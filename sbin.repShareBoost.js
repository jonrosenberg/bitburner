import { reservedHomeRam } from "./var.constants";
import { dpList } from "./lib.utils";
import HackableBaseServer from "./if.server.hackable"

const argsSchema = [
  ['rounds',-1],
  ['r',-1],
];

/** @param {NS} ns */
function doShare(ns,serverName) {
  let freeRam = ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName);
  if(serverName == "home") { freeRam -= reservedHomeRam; }
  freeRam = freeRam < 0 ? 0 : freeRam;
  let numThreads = Math.floor(freeRam/4)
  if( numThreads > 0) { return [ns.exec("bin.sh.js",serverName,numThreads),numThreads,freeRam];}
  return [0,numThreads,freeRam];
}

/** @param {NS} ns */
export async function main(ns) {
  const options = ns.flags(argsSchema);
  const totalRounds = Math.max(options.rounds, options.r);
  const hasRounds = totalRounds >= 0;
  
  ns.print("servers:");
  let slist = dpList(ns);
  let servers = [];
  const index = slist.indexOf("home");
  const x = slist.splice(index, 1);
  ns.print(slist);
  const plist = ns.getPurchasedServers()
  ns.print("INFO hacked servers")
  const hlist = slist.filter(n => !plist.includes(n));
  ns.print(hlist);
  ns.print("INFO purchased servers")
  ns.print(plist);
  for (let s of slist) {
		servers.push(new HackableBaseServer(ns, s))
	}

  for (let server of servers) {
		ns.scp(["bin.sh.js"], server.id, "home")
	}
  let round = 0;
  ns.print(`# rounds ${totalRounds}`);
  while(!hasRounds || round < totalRounds) {
    ++round;
    let [ pidNum,  numThreads, freeRam] = doShare(ns,"home");
    for (let s of slist) {
      numThreads += doShare(ns,s)[1];
    }
    ns.print(`INFO\nAvialable Ram ${ns.formatNumber(freeRam)}
Num of thread sh runs ${ns.formatNumber(numThreads)}`);
    if( numThreads > 0) { pidNum = ns.exec("bin.sh.js","home",numThreads);}
    await ns.sleep(10);
    ns.print(`ns.getSharePower(): ${ns.getSharePower()}`);
    ns.print(pidNum);
    await ns.sleep(10*1000-10);
  }
}