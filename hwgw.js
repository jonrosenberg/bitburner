/** @param {NS} ns **/
import HackableBaseServer from "./if.server.hackable"
import BasePlayer from "./if.player";
import {numCycleForGrowthCorrected} from "./if.server.hackable"
/**
 * returns an array of servers dynamically
 */
function dpList(ns, current="home", set=new Set()) {
	let connections = ns.scan(current)
	let next = connections.filter(c => !set.has(c))
	next.forEach(n => {
		set.add(n);
		return dpList(ns, n, set)
	})
	return Array.from(set.keys())
}

function runningThreads(ns, current="home") {
  let runWkThreads = 0;
  let runGrThreads = 0;
  let runHkThreads = 0;
  for (let pi of ns.ps("home")) {
    switch(pi.filename) {
      case "bin.wk.js":
        runWkThreads += pi.threads;
        break;
      case "bin.gr.js":
        runGrThreads += pi.threads;
        break;
      case "bin.hk.js":
        runHkThreads += pi.threads;
        
        break;
    }
  }
  return [runWkThreads, runGrThreads, runHkThreads]
}

/** @param {NS} ns */
export async function main(ns) {
  let targetName = ns.args[0];
  if (!targetName) {
    targetName = "n00dles"
  }
  let hack_percent = ns.args[1];
  if (!hack_percent) {
    hack_percent = 0.1;
  }
  let sList = dpList(ns)
	let servers = [];
	let player = new BasePlayer(ns, "player")
	await player.updateCache(false)
	for (let s of sList) {
		let server = new HackableBaseServer(ns, s)
		servers.push(server);
	}
  servers.sort((a,b) => a.isHome - b.isHome);
  let target = new HackableBaseServer(ns, targetName);
  let home = new HackableBaseServer(ns, "home");
  let grow_threads;
  let weak_threads1;
  let weak_threads2;
  let curWkThreads, curGrThreads, curHkThreads;
  do {
    [curWkThreads, curGrThreads, curHkThreads] = runningThreads(ns);
    grow_threads = numCycleForGrowthCorrected(ns.getServer(target.id), target.money.max, target.money.available, ns.getHackingMultipliers(), home.cores);
    grow_threads -= curGrThreads;
    weak_threads1 = Math.ceil((target.security.level - target.security.min) * 20);
    weak_threads1 -= curWkThreads;
    weak_threads2 = Math.ceil(grow_threads / 12.5);
    
    if (home.threadCount(1.8) >= (grow_threads + weak_threads1 + weak_threads2)) {
      if(weak_threads1 > 0) {
        ns.exec("bin.wk.js", "home", weak_threads1, target.id);
        }
      if(grow_threads > 0) {ns.exec("bin.gr.js", "home", grow_threads, target.id);}
      if(weak_threads2 > 0) {ns.exec("bin.wk.js", "home", weak_threads2, target.id);}
    } else if (home.threadCount(1.8) > 0) {
      if (weak_threads1 > 0) {
        ns.exec("bin.wk.js", "home", Math.min(weak_threads1,home.threadCount(1.8)), target.id);
      } else if (grow_threads > 0){
        ns.exec("bin.gr.js", "home", Math.min(grow_threads,home.threadCount(1.8)), target.id);
      } else if (weak_threads2 > 0){
        ns.exec("bin.wk.js", "home", Math.min(weak_threads1,home.threadCount(1.8)), target.id);
      }
    }

    await ns.sleep(200);
  } while (grow_threads > 0 || weak_threads1 > 0 || weak_threads2 > 0 || curGrThreads > 0 || curWkThreads > 0 )
  while (true) {
    let attackers = servers.filter(s => s.isAttacker);
    let available_ram = new Map();
    for (let server of attackers) {
      available_ram.set(server.id, server.ram.free);
    }
    let hack_threads = Math.floor(ns.hackAnalyzeThreads(target.id, target.money.max * hack_percent));
    weak_threads1 = Math.ceil((hack_threads / 25) + (target.security.level - target.security.min) * 20);
    grow_threads = numCycleForGrowthCorrected(ns.getServer(target.id), target.money.max, target.money.available, ns.getHackingMultipliers(), home.cores);
    grow_threads += numCycleForGrowthCorrected(ns.getServer(target.id), target.money.max, target.money.max * (1 - hack_percent), ns.getHackingMultipliers(), home.cores);
    weak_threads2 = Math.ceil(hack_threads / 12.5);

    let hack_time = ns.getHackTime(target.id);
    let grow_time = hack_time * 3.2;
    let weaken_time = hack_time * 4;
    let currentTime = performance.now();
    let next_landing = weaken_time + 3000 + currentTime;    
    let nextBatch = [];
    let proposed_batch = {
      hk: hack_threads,
      wk1: weak_threads1,
      gr: grow_threads,
      wk2: weak_threads2
    }

    for (let server of servers) {
      if (proposed_batch.hk > 0 ) {
        if (available_ram.get(server.id) > proposed_batch.hk * 1.75) {
          nextBatch.push({
            attacker: server.id,
            filename: "bin.hk.js",
            threads: proposed_batch.hk,
            landing: next_landing
          })
          available_ram.set(server.id, available_ram.get(server.id) - proposed_batch.hk * 1.75);
          proposed_batch.hk = 0;
        }
      }
    }

    if (available_ram.get(home.id) > proposed_batch.gr * 1.8) {
      nextBatch.push({
        attacker: home.id,
        filename: "bin.gr.js",
        threads: proposed_batch.gr,
        landing: next_landing + 80
      });
      available_ram.set(home.id, available_ram.get(home.id) - proposed_batch.gr * 1.8);
      proposed_batch.gr = 0;
    }
    
    for (let server of servers) {
      if (proposed_batch.wk1 > 0 ) {
        if (available_ram.get(server.id) > proposed_batch.wk1 * 1.8) {
          nextBatch.push({
            attacker: server.id,
            filename: "bin.wk.js",
            threads: proposed_batch.wk1,
            landing: next_landing + 40
          })
          available_ram.set(server.id, available_ram.get(server.id) - proposed_batch.wk1 * 1.8);
          proposed_batch.wk1 = 0;
        
        } else {
          let available_threads = Math.floor((available_ram.get(server.id)/ 1.8));
          if (available_threads > 0) {
            let batch = {
              attacker: server.id,
              filename: "bin.wk.js",
              threads: available_threads,
              landing: next_landing + 40
            }
            nextBatch.push(batch)
            available_ram.set(server.id, available_ram.get(server.id) - batch.threads * 1.8);
            proposed_batch.wk1 = proposed_batch.wk1 - batch.threads;
          }
        }
      }
      if (proposed_batch.wk2 > 0){
        if (available_ram.get(server.id) > proposed_batch.wk2 * 1.8) {
          nextBatch.push({
            attacker: server.id,
            filename: "bin.wk.js",
            threads: proposed_batch.wk2,
            landing: next_landing + 120
          })
          available_ram.set(server.id, available_ram.get(server.id) - proposed_batch.wk2 * 1.8);
          proposed_batch.wk2 = 0;
        
        } else {
          let available_threads = Math.floor((available_ram.get(server.id)/ 1.8));
          if (available_threads > 0) {
            let batch = {
              attacker: server.id,
              filename: "bin.wk.js",
              threads: available_threads,
              landing: next_landing + 120
            }
            nextBatch.push(batch)
            available_ram.set(server.id, available_ram.get(server.id) - batch.threads * 1.8);
            proposed_batch.wk2 = proposed_batch.wk2 - batch.threads;
          }
        }
      }
    }
    let wkSanityCheck = nextBatch.filter(batch => batch.filename == "bin.wk.js")
    let hkSanityCheck = nextBatch.filter(batch => batch.filename == "bin.hk.js")
    let grSanityCheck = nextBatch.filter(batch => batch.filename == "bin.gr.js")
    
    if (wkSanityCheck.reduce((a,b) => a + b.threads, 0) == weak_threads1 + weak_threads2) {
      if (hkSanityCheck.reduce((a,b) => a + b.threads, 0) == hack_threads) {
        if (grSanityCheck.reduce((a,b) => a + b.threads, 0) == grow_threads) {
          for (let cmd of nextBatch) {
            ns.exec(cmd.filename, cmd.attacker, cmd.threads, target.id, false, cmd.landing)
          }
        }
      }
    }
    
    await ns.sleep(160);

  }

	// for (let server of servers) {
	// 	await server.updateCache(false);
	// }
}