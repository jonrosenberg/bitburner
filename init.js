import BasePlayer from "if.player";
import { dpList } from "./lib.utils";
import HackableBaseServer from "./if.server.hackable"

/** @param {NS} ns */
export async function main(ns) {
  // spawn relevant subscripts given the "status" of the game
  let status = ns.args[0]; // an integer from 0 to ~100 represents how many times we've reset 
  ns.tprint("status: "+status);
  
  let player = new BasePlayer(ns, "player");
  
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
  ns.print("Running weak threads: "+runWkThreads);
  ns.print("Running grow threads: "+runGrThreads);
  ns.print("Running hack threads: "+runHkThreads);
  // ns.print(ns.getRunningScript("bin.wk.js"));
  // ns.print(ns.getRunningScript("bin.gr.js"));

  ns.print("cost of 1 ram: "+ns.getPurchasedServerCost(1));
  ns.print("cost of 100 ram: "+ns.getPurchasedServerCost(512));
  ns.print("servers:");
  let slist = dpList(ns);
  let servers = [];
  ns.print(slist);
  ns.print(slist.length);
  ns.tail();

  for (let s of slist) {
		servers.push(new HackableBaseServer(ns, s))
	}

  ns.tprint("add files to servers")
  ns.tprint(slist.length)
  ns.tprint(servers.length)
	for (let server of servers) {
    server.sudo();
		ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server.id, "home")
	}


  if (player.market.api.fourSigma) {
    ns.tprint("run sbin.market.js");
    ns.run("sbin.market.js");
  }

  if (ns.getServerMoneyAvailable("home") < Math.pow(10,12)) {
    ns.tprint("run hnet.js");
    ns.run("hnet.js");
  } else {
    ns.tprint("run hnet-full.js");
    ns.run("hnet-full.js");
  }

  let pid;
  while (!player.software.ssh) {
    if (!pid) {
      ns.tprint("run maxcash.js");
      pid = ns.run("maxcash.js");
    }
    await ns.sleep(10);
  } 

  try {
    if (pid) { ns.kill(pid); }
  } catch {}
  // ns.tprint("run go.js");
  // ns.run("go.js");
  
}