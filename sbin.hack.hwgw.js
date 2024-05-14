import HWGWBaseServer from "./if.server.hwgw"
import HackableBaseServer from "./if.server.hackable"

import { numCycleForGrowthCorrected } from "./if.server.hwgw"
import { dpList } from "./lib.utils";
import { hcns, fmt, ansi, msToTime, bin } from "./var.constants";

const argsSchema = [
  ['sanity', false],
  ['share', false],
  ['noPrep', false],
];
let options;

/** @param {NS} ns **/
export async function main(ns) {
    options = ns.flags(argsSchema);
    ns.disableLog("getHackingLevel");
    ns.disableLog("exec");
    // gather servers stage
    let servers = dpList(ns).map(s => new HWGWBaseServer(ns, s))
    servers.forEach(s => ns.scp([bin.wk.id, bin.hk.id, bin.gr.id], s.id, "home"));
    let available_ram = new Map();
    ns.tail();
    while(true) {
      
      
      for (let server of servers) {
        // if (!server.admin && server.ports.required <= player.ports) {
        if (!server.admin) {
          server.sudo();
          ns.scp([bin.wk.id, bin.hk.id, bin.gr.id], server.id, "home")
        }
      }    
      let targets = servers.filter(s => s.isTarget);
      // let home = [new HWGWBaseServer(ns, 'home')];
      // let attackers = home.filter(s => s.isAttacker);
      let attackers = servers.filter(s => s.isAttacker);
      // ns.print(`targets ${targets.length}`)
      // ns.print(`attackers ${attackers.length}`)
      attackers.forEach(a => available_ram.set(a.id, a.ram.free))
  
      // sort stage
      attackers.sort((a,b) => a.isHome - b.isHome)
      // sort targets val descending aka from highest val=($ per Thread/Sec) to lowest
      targets.sort((a,b) => b.hwgw_value - a.hwgw_value)
      
      // prep stage
      let ready_targets = targets.filter(t => t.money.max == t.money.available && t.security.level == t.security.min)
      let unready_targets = targets.filter(t => t.money.max != t.money.available || t.security.level != t.security.min)
      // ensure the minimum required ready targets
      let required_ready_targets = targets.reduce(function(acc, target) {
        let batch_ram = target.perfect_batch.hk * bin.hk.ram + target.perfect_batch.gr * bin.gr.ram + target.perfect_batch.wk1 * bin.wk.ram + target.perfect_batch.wk2 * bin.wk.ram;
        let simultaneous_batches = (ns.getHackTime(target.id) * hcns.num_simultaneous_batches) / hcns.batch_lag;
        let ram_required = batch_ram * simultaneous_batches;

        if (ram_required <= acc[acc.length-1]) {
          acc.push(acc[acc.length - 1] - ram_required)
        }
        return acc

      },[attackers.reduce((a,b) => a + b.ram.max, 0)]).length

      // let required_ready_targets = 11;
      ns.print(`ready_targets.length >= required_ready_targets: ${ready_targets.length} >= ${required_ready_targets}`)
      if (ready_targets.length >= required_ready_targets*hcns.targets) {
        // hwgw stage
        for (let target of ready_targets) {
          let proposed_batch = calculate_hwgw_batch(ns, target);
          let result = run_hwgw_batch(ns, attackers, target, proposed_batch, available_ram);
          if (result) {
            available_ram = result;
          }
          await ns.sleep(1);
        }
      } else {
        // prepare more ready targets
        let prepTimes = [];
        for (let target of unready_targets) {
          let proposed_batch = calculate_hwgw_batch(ns, target, true);
          let result = run_hwgw_batch(ns, attackers, target, proposed_batch, available_ram);
          if (result) {
            available_ram = result;
            // prepTimes.push(Math.ceil(proposed_batch.landing.wk2 - performance.now()))
            prepTimes.push(Math.ceil(proposed_batch.landing.wk2))
          }
          await ns.sleep(hcns.batch_lag);
        }
        ns.print(`!options.noPrep: ${!options.noPrep} prepTimes: ${prepTimes.length}`)
        if (prepTimes.length > 0 && !options.noPrep) {
          prepTimes.sort((a,b) => b-a);
          let maxPrepTime = prepTimes[0];
          prepTimes.sort((a,b) => a-b);
          let minPrepTime = prepTimes[0];
          let prepTime = (maxPrepTime + (minPrepTime*(hcns.time-1)))/hcns.time;
          const rounds = Math.floor(prepTime/(bin.sh.runtime+20));
          if(rounds > 0 && options.share) { ns.run("sbin.repShareBoost.js",1, "--rounds", rounds)}
          ns.print(`${ansi([fmt.bgTurquoise,fmt.Blue])}Sleep: ${msToTime(prepTime)}${ansi()}${options.share ? ansi([fmt.bgTurquoise,fmt.Green])+' Share:'+rounds+ansi():''} max: ${msToTime(maxPrepTime)} min: ${msToTime(minPrepTime)}`);
          await ns.sleep(prepTime)
        }
      }

      await ns.sleep(hcns.batch_lag)
    }
}

function reduce_available_ram(ram_map, attacker, threads, threadRam) {
  ram_map.set(attacker.id, ram_map.get(attacker.id) - (threads * threadRam))
  return ram_map
}

function reduce_proposed_batch(proposed_batch, property, threads) {
  proposed_batch.threads[property] -= threads
  return proposed_batch
}
/**
 * get runtime for hk,wk,gr files in milliseconds or str format
 */
const execRuntime = (targetHackTime) => {
  let results = {};
  Object.entries(bin).forEach((v) => { results[v[1].id] = v[1].id != 'sh' ? {
        ms:(targetHackTime * v[1].runtimeMult), str:msToTime(targetHackTime * v[1].runtimeMult) 
      } : { ms:(v[1].runtime), str:msToTime(v[1].runtime) }});
  return results
}

/**
 * Calculates required threads and timings for an hwgw batch.
 * 
 * @param {import(".").NS} ns 
 * @param {HackableBaseServer} target 
 * @returns 
 */
/** @param {NS} ns **/
function calculate_hwgw_batch(ns, target, prep_batch=false) {
  const home = new HackableBaseServer(ns, "home")
  const batch_lag = hcns.batch_lag*10;
    
  const hackThreads = (prep_batch) ? 0 : target.perfect_batch.hk;
  const weakThreads1 = target.perfect_batch.wk1 + ((target.security.level - target.security.min) * 20);
  let growThreads = numCycleForGrowthCorrected(
    ns.getServer(target.id), 
    target.money.max, 
    target.money.available, 
    ns.getHackingMultipliers(), 
    home.cores,
    ns);
  // ns.print(`${ansi([fmt.Bold,fmt.bgGray,fmt.Yellow])}${growThreads}=${ns.formulas.hacking.growThreads(ns.getServer(target.id),ns.getPlayer(),target.money.max,home.cores)}`)
  growThreads += (prep_batch) ? 0 : target.perfect_batch.gr
    
    
  const weakThreads2 = target.perfect_batch.wk2  
  const hackTime = (hackThreads) ? ns.getHackTime(target.id) : 0;
  const growTime = (growThreads) ? ns.getHackTime(target.id) * bin.gr.runtimeMult : 0;// ns.getGrowTime(target.id) : 0;
  const weakenTime = (weakThreads1 || weakThreads2) ? ns.getHackTime(target.id) * bin.wk.runtimeMult : 0;//ns.getWeakenTime(target.id) : 0;
  const currentTime = 0; //performance.now();
  const next_landing = Math.max(hackTime, growTime, weakenTime) + currentTime + batch_lag; //- ns.getHackTime(target.id);
  ns.print(`${ansi([1,32,43])} landing:${msToTime(next_landing)}\n hk:${msToTime(hackTime)}\n gr:${msToTime(growTime)}\n wk:${msToTime(weakenTime)}`)
  return {
    threads: {
      hk: hackThreads,
      wk1: weakThreads1,
      gr: growThreads,
      wk2: weakThreads2
    },
    landing: {
      hk: Math.floor(next_landing - hackTime),
      wk1: Math.floor(next_landing + (batch_lag * .25) - weakenTime),
      gr: Math.floor(next_landing + (batch_lag * .5) - growTime),
      wk2: Math.floor(next_landing + (batch_lag * .75) - weakenTime)
    },
    filename: {
      hk: bin.hk.id,
      gr: bin.gr.id,
      wk: bin.wk.id
    },
    ram: {
      hk: bin.hk.ram,
      gr: bin.gr.ram,
      wk: bin.wk.ram
    },
  }
}

/**
 * Execs a full batch, if possible. Otherwise, does nothing.
 * 
 * @param {import(".").NS} ns 
 * @param {HackableBaseServer[]} attackers 
 * @param {HackableBaseServer} target 
 * @param {Object} batch 
 * @param {Map<id,ram>} ram_map 
 * @returns 
 */
/** @param {NS} ns **/
function run_hwgw_batch(ns, attackers, target, batch, available_ram) {
    let nextBatch = [];
    const hackThreads = batch.threads.hk >= 0 ? batch.threads.hk : 0;
    const growThreads = batch.threads.gr >= 0 ? batch.threads.gr : 0;
    const weakThreads1 = Math.floor(batch.threads.wk1) >= 0 ? Math.floor(batch.threads.wk1) : 0;
    const weakThreads2 = batch.threads.wk2 >= 0 ? batch.threads.wk2 : 0;
    let ram_map = new Map(available_ram); // clone the map so we don't modify it if we fail sanity checks
  
    attackers.forEach(function(a) {
        let alloc;
        // localize grow threads to home
        if (a.isHome) {
            
            alloc = Math.floor(Math.min(batch.threads.gr, ram_map.get(a.id) / batch.ram.gr))

            if (alloc > 0) {
                nextBatch.push({
                    attacker: a.id,
                    filename: batch.filename.gr,
                    threads: alloc,
                    landing: batch.landing.gr,
                    id: 'grh'
                })
                ram_map = reduce_available_ram(ram_map, a, alloc, batch.ram.gr)
                batch = reduce_proposed_batch(batch, "gr", alloc)
            }
        }
        
        // localize hack threads to any single server that can handle the load
        alloc = Math.floor(Math.min(batch.threads.hk, ram_map.get(a.id) / batch.ram.hk))

        if (alloc == batch.threads.hk && alloc > 0) {
            nextBatch.push({
                attacker: a.id,
                filename: batch.filename.hk,
                threads: alloc,
                landing: batch.landing.hk,
                id: 'hk '
            })
            ram_map = reduce_available_ram(ram_map, a, alloc, batch.ram.hk)
            batch = reduce_proposed_batch(batch, "hk", alloc)
        }

        // distribute weak threads among any remaining servers
        alloc = Math.floor(Math.min(batch.threads.wk1, ram_map.get(a.id) / batch.ram.wk))
        if (alloc > 0) {
            nextBatch.push({
                attacker: a.id,
                filename: batch.filename.wk,
                threads: alloc,
                landing: batch.landing.wk1,
                id: 'wk1'
            })
            ram_map = reduce_available_ram(ram_map, a, alloc, batch.ram.wk)
            batch = reduce_proposed_batch(batch, "wk1", alloc)
        }

        alloc = Math.floor(Math.min(batch.threads.wk2, ram_map.get(a.id) / batch.ram.wk))
        if (alloc > 0) {
            nextBatch.push({
                attacker: a.id,
                filename: batch.filename.wk,
                threads: alloc,
                landing: batch.landing.wk2,
                id: 'wk2'
            })
            ram_map = reduce_available_ram(ram_map, a, alloc, batch.ram.wk)
            batch = reduce_proposed_batch(batch, "wk2", alloc)
        }

        alloc = Math.floor(Math.min(batch.threads.gr, ram_map.get(a.id) / batch.ram.gr))
        
        if (alloc > 0) {
            nextBatch.push({
                attacker: a.id,
                filename: batch.filename.gr,
                threads: alloc,
                landing: batch.landing.gr,
                id: 'gr '
            })
            ram_map = reduce_available_ram(ram_map, a, alloc, batch.ram.gr)
            batch = reduce_proposed_batch(batch, "gr", alloc)
        }

    })
    
    const wkScheduled = nextBatch.filter(b => b.filename == batch.filename.wk)
    const hkScheduled = nextBatch.filter(b => b.filename == batch.filename.hk)
    const grScheduled = nextBatch.filter(b => b.filename == batch.filename.gr)

    const wkSanityCheck = (wkScheduled.reduce((a,b) => a + b.threads, 0) == (weakThreads1 + weakThreads2))
    const hkSanityCheck = (hkScheduled.reduce((a,b) => a + b.threads, 0) == hackThreads)
    const grSanityCheck = (grScheduled.reduce((a,b) => a + b.threads, 0) == growThreads)
    ns.print(`${!options.sanity && (!wkSanityCheck || !hkSanityCheck || !grSanityCheck) ? ansi([fmt.Red]) : ansi()}Sanity wk: ${wkScheduled.reduce((a,b) => a + b.threads, 0)}=${(weakThreads1 + weakThreads2)} hk: ${hkScheduled.reduce((a,b) => a + b.threads, 0)}=${hackThreads} gr: ${grScheduled.reduce((a,b) => a + b.threads, 0)}=${growThreads}`);
    // make sure our batch matches the threads requested initially
    // exec and return modified ram
    if (options.sanity || (wkSanityCheck && hkSanityCheck && grSanityCheck) ) {
      
      let bt = execRuntime(ns.getHackTime(target.id));
      // bt = {}
      // const hkt = ns.getHackTime(target.id);
      // const grt = ns.getGrowTime(target.id);
      // const wkt = ns.getWeakenTime(target.id);
      // bt[bin.hk.id]= {ms:hkt, str:msToTime(hkt)};
      // bt[bin.gr.id]= {ms:grt, str:msToTime(grt)};        
      // bt[bin.wk.id]= {ms:wkt, str:msToTime(wkt)};
      
      for (let cmd of nextBatch) {
        ns.exec(cmd.filename, cmd.attacker, cmd.threads, target.id, false, cmd.landing, `${msToTime(bt[cmd.filename].ms+cmd.landing)} T:${bt[cmd.filename].str.slice(0, -6)} + LND:${msToTime(cmd.landing)}`)
      }
      ns.print(`${ansi([fmt.Bold,fmt.Underline,fmt.bgLightGray,fmt.Cyan])}${nextBatch.length} -> ${target.id} `);
      
      for (let cmd of nextBatch) {
        ns.print(`${ansi([fmt.Bold,fmt.bgGray,fmt.Yellow])} ${cmd.id} ${msToTime(bt[cmd.filename].ms+cmd.landing)} ${cmd.attacker}:${cmd.threads}${ansi()} landing: ${msToTime(cmd.landing)} `)
      }
      return ram_map
        
    }
}