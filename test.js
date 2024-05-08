import { fmt, ansi } from "./var.constants";
import { dpList } from "./lib.utils";
import HackableBaseServer from "./if.server.hackable"



/** @param {NS} ns */
export async function main(ns) {
  ns.tail()
  
  //ns.print("servers: \u001b[1;40;4;32m; bye \u001b[31m hi red \u001b[0m back to normal");
  ns.print(`${ansi([fmt.Bold,fmt.Underline,fmt.Cyan,fmt.bgTurquoise])}ANSI function${ansi()} back to nromal`)
  ns.exit();
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

  ns.tprint("add files to servers")
  ns.tprint(slist.length)
  ns.tprint(servers.length)
	for (let server of servers) {
    server.sudo();
		ns.scp(["bin.sh.js"], server.id, "home")
	}
  
  ns.tprint(ns.run("sbin.repShareBoost.js",1, "--rounds", 3));
}