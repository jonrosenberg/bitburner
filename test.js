import { dpList } from "./lib.utils";
import HackableBaseServer from "./if.server.hackable"

/** @param {NS} ns */
export async function main(ns) {
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
		await ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server.id, "home")
	}
}