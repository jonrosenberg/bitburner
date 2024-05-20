import { fmt, ansi, bin, msToTime } from "./var.constants";
import { dpList } from "./lib.utils";
import HackableBaseServer from "./if.server.hackable"

const execRuntime = (targetHackTime, toStr=false) => {
  let results = {};
  Object.entries(bin).forEach((v) => { results[v[1].id] = v[1].id != 'sh' ? {
        ms:(targetHackTime * v[1].runtimeMult), str:msToTime(targetHackTime * v[1].runtimeMult) 
      } : { ms:(v[1].runtime), str:msToTime(v[1].runtime) }});
  return results
}

/** @param {NS} ns */
export async function main(ns) {
  ns.tail()
  ns.clearLog()
  document.getElementById('unclickable').parentNode.addEventListener('click', () => {
    document.getElementById('unclickable').style = "display: none; visibility: hidden;";
  }, true);
  //let doc = eval("ns.bypass(document);");

  //ns.bypass(document)
  ns.print(`${ansi([fmt.Bold,fmt.Underline,fmt.Cyan,fmt.bgTurquoise])}Karma: ${ns.heart.break()}`);
  //ns.print("servers: \u001b[1;40;4;32m; bye \u001b[31m hi red \u001b[0m back to normal");
  ns.print(`${ansi([fmt.Bold,fmt.Underline,fmt.Cyan,fmt.bgTurquoise])}ANSI function${ansi()} back to nromal`)
  const er = execRuntime(109990);
  ns.print(er)
  // ns.print(er[bin.hk.id].ms + " str: "+er[bin.hk.id].str)
  // ns.print(er[bin.wk.id].ms + " str: "+er[bin.wk.id].str)
  // ns.print(er[bin.gr.id].ms + " str: "+er[bin.gr.id].str)
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