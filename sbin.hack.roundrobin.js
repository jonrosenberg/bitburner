/** @param {NS} ns **/
import HackableBaseServer from "./if.server.hackable"
import BasePlayer from "./if.player";
import { dpList } from "./lib.utils"

/** @param {NS} ns **/
export async function main(ns) {
	let sList = dpList(ns)
	let servers = [];
	let player = new BasePlayer(ns, "player")
	await player.updateCache(false)
	for (let s of sList) {
		let server = new HackableBaseServer(ns, s)
		servers.push(server);
	}

	for (let server of servers) {
		await server.updateCache(false);
	}

	
  let targets = [];
  targets.push(new HackableBaseServer(ns, "n00dles"));
  targets.push(new HackableBaseServer(ns, "n00dles"));
  targets.push(new HackableBaseServer(ns, "n00dles"));
  targets.push(new HackableBaseServer(ns, "n00dles"));
	targets.push(new HackableBaseServer(ns, "foodnstuff"));
	targets.push(new HackableBaseServer(ns, "foodnstuff"));
  targets.push(new HackableBaseServer(ns, "sigma-cosmetics"));
  targets.push(new HackableBaseServer(ns, "joesguns"));
  targets.push(new HackableBaseServer(ns, "nectar-net"));
  targets.push(new HackableBaseServer(ns, "hong-fang-tea"));
  targets.push(new HackableBaseServer(ns, "zer0"));
  targets.push(new HackableBaseServer(ns, "max-hardware"));
  targets.push(new HackableBaseServer(ns, "harakiri-sushi"));
  targets.push(new HackableBaseServer(ns, "iron-gym"));
	ns.disableLog("ALL");
	for (let server of servers) {
		ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server.id, "home");
	}

	while(true) {
		for (let server of servers) {
      for (let target of targets) {
        if (server.admin && target.admin) {
          // divert all of this server's available threads to the most valuable command
          if (target.security.level > target.security.min) {
            let available_threads = Math.ceil(server.threadCount(1.8)/targets.length)
            // weaken the target while security > minsecurity
            if (available_threads >= 1) {
              // ns.print(`${server.id} server.wk: ${available_threads}`)
              ns.exec("bin.wk.js", server.id, available_threads, target.id)
            }
          } else if (target.money.available < target.money.max) {
            let available_threads = Math.ceil(server.threadCount(1.8)/targets.length)

            // grow the target while money < maxmoney
            if (available_threads >= 1) {
              // ns.print(`${server.id} server.gr: ${available_threads}`)
              ns.exec("bin.gr.js", server.id, available_threads, target.id)
            }
          } else {
            let available_threads = Math.ceil(server.threadCount(1.75)/targets.length)

            // hack the target
            if (available_threads >= 1) {
              // ns.print(`${server.id} server.hk: ${available_threads}`)
              ns.exec("bin.hk.js", server.id, available_threads, target.id)
            } 
          }

        } else {
          server.sudo();  
        }

      await ns.sleep(10)
      }
    }
	}
}