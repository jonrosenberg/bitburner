import HWGWBaseServer from "./if.server.hwgw"
import HackableBaseServer from "./if.server.hackable"

import { numCycleForGrowthCorrected } from "./if.server.hwgw"
import { dpList } from "./lib.utils";
import { hwgw_amp, fmt, ansi } from "./var.constants";

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
    // gather servers stage
    let servers = dpList(ns).map(s => new HWGWBaseServer(ns, s))
    
    let available_ram = new Map();
    ns.tail();
    while(true) {
      
      
      for (let server of servers) {
        // if (!server.admin && server.ports.required <= player.ports) {
        if (!server.admin) {
          server.sudo();
          ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server.id, "home")
        }
      }     
      let targets = servers.filter(s => s.isTarget);
      let attackers = servers.filter(s => s.isAttacker);
      ns.print(`targets ${targets.length}`)
      ns.print(`attackers ${attackers.length}`)
      attackers.forEach(a => available_ram.set(a.id, a.ram.free))
  
      // sort stage
      attackers.sort((a,b) => a.isHome - b.isHome)
      targets.sort((a,b) => b.hwgw_value - a.hwgw_value)
      
      // prep stage
      let ready_targets = targets.filter(t => t.money.max == t.money.available && t.security.level == t.security.min)
      let unready_targets = targets.filter(t => t.money.max != t.money.available || t.security.level != t.security.min)
      // ensure the minimum required ready targets
      let required_ready_targets = targets.reduce(function(acc, target) {
        let batch_ram = target.perfect_batch.hk * 1.75 + target.perfect_batch.gr * 1.8 + target.perfect_batch.wk1 * 1.8 + target.perfect_batch.wk2 * 1.8;
        let simultaneous_batches = (ns.getHackTime(target.id) * hwgw_amp.num_simultaneous_batches) / 160;
        let ram_required = batch_ram * simultaneous_batches;

        if (ram_required <= acc[acc.length-1]) {
          acc.push(acc[acc.length - 1] - ram_required)
        }
        return acc

      },[attackers.reduce((a,b) => a + b.ram.max, 0)]).length

      // let required_ready_targets = 11;
      ns.print(`ready_targets.length >= required_ready_targets: ${ready_targets.length} >= ${required_ready_targets}`)
      if (ready_targets.length >= required_ready_targets*hwgw_amp.targets) {
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
            prepTimes.push(Math.ceil(proposed_batch.landing.wk2 - performance.now()))
          }
          await ns.sleep(160);
        }
        ns.print(`!options.noPrep: ${!options.noPrep} prepTimes: ${prepTimes.length}`)
        await ns.sleep(1000)
        if (prepTimes.length > 0 && !options.noPrep) {
          prepTimes.sort((a,b) => b-a);
          let maxPrepTime = prepTimes[0];
          ns.print(ansi([fmt.bgBlue])+"maxPrepTime: "+maxPrepTime);
          prepTimes.sort((a,b) => a-b);
          let minPrepTime = prepTimes[0];
          ns.print(ansi([fmt.bgBlue])+"minPrepTime: "+minPrepTime);
          let prepTime = (maxPrepTime + (minPrepTime*(hwgw_amp.time-1)))/hwgw_amp.time;
          const rounds = Math.floor(prepTime/(10020));
          if(rounds > 0 && options.share) { ns.run("sbin.repShareBoost.js",1, "--rounds", Math.floor(prepTime/(10020)))}
          await ns.sleep(prepTime)
        }
      }

      await ns.sleep(160)
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
 * Calculates required threads and timings for an hwgw batch.
 * 
 * @param {import(".").NS} ns 
 * @param {HackableBaseServer} target 
 * @returns 
 */
/** @param {NS} ns **/
function calculate_hwgw_batch(ns, target, prep_batch=false) {
  const home = new HackableBaseServer(ns, "home")
  const batch_lag = 160;
    
  const hackThreads = (prep_batch) ? 0 : target.perfect_batch.hk;
  const weakThreads1 = target.perfect_batch.wk1 + ((target.security.level - target.security.min) * 20);
  let growThreads = numCycleForGrowthCorrected(
    ns.getServer(target.id), 
    target.money.max, 
    target.money.available, 
    ns.getHackingMultipliers(), 
    home.cores,
    ns);
  growThreads += (prep_batch) ? 0 : target.perfect_batch.gr
    
    
  const weakThreads2 = target.perfect_batch.wk2

  const hackTime = (hackThreads) ? ns.getHackTime(target.id) : 0;
  const growTime = (growThreads) ? ns.getHackTime(target.id) * 3.2 : 0;
  const weakenTime = (weakThreads1 || weakThreads2) ? ns.getHackTime(target.id) * 4 : 0;
  const currentTime = performance.now();
  const next_landing = Math.max(hackTime, growTime, weakenTime) + currentTime + batch_lag;

  return {
    threads: {
      hk: hackThreads,
      wk1: weakThreads1,
      gr: growThreads,
      wk2: weakThreads2
    },
    landing: {
      hk: Math.floor(next_landing),
      wk1: Math.floor(next_landing + (batch_lag * .25)),
      gr: Math.floor(next_landing + (batch_lag * .5)),
      wk2: Math.floor(next_landing + (batch_lag * .75))
    },
    filename: {
      hk: "bin.hk.js",
      gr: "bin.gr.js",
      wk: "bin.wk.js"
    },
    ram: {
      hk: 1.75,
      gr: 1.8,
      wk: 1.8
    }
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
                    landing: batch.landing.gr
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
                landing: batch.landing.hk
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
                landing: batch.landing.wk1
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
                landing: batch.landing.wk2
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
                landing: batch.landing.gr
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
        for (let cmd of nextBatch) {
            ns.exec(cmd.filename, cmd.attacker, cmd.threads, target.id, false, cmd.landing)
        }
        return ram_map
    }
}