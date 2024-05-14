import { dpList } from "./lib.utils";
import { fmt, ansi, msToTime } from "./var.constants";
/** @param {NS} ns */
export async function main(ns) {
    const flags = ns.flags([
        ['refreshrate', 200],
        ['help', false],
    ])
    if (flags.help) {
        ns.tprint("This script helps visualize the money and security of a server.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`)
        return;
    }
    ns.tail();
    ns.disableLog('ALL');
    const servers = dpList(ns);
    
    for (let i = 0; i < servers.length; i++) {
      const mM = ns.getServerMaxMoney(servers[i]);
      if (servers[i] == '.') {ns.print("$$$$$ "+servers[i])}
      if (mM == 0) {   
        servers.splice(i, 1);
        --i;
      }
      
    }
    let count = 0;
    while (true) {
      ns.clearLog();
      count = 0;
      for (let server of servers) {
        ++count;
        let money = ns.getServerMoneyAvailable(server);
        if (money === 0) money = 1;
        const maxMoney = ns.getServerMaxMoney(server);
        const minSec = ns.getServerMinSecurityLevel(server);
        const sec = ns.getServerSecurityLevel(server);
        ns.print(`${ansi([1,33])}${count}/${servers.length} ${server}${ansi()}:\$${ns.formatNumber(money)}/${ns.formatNumber(maxMoney,3,1000)} ${ansi([1,32])}${(money / maxMoney * 100).toFixed(2)}%${ansi()} sec:+${(sec - minSec).toFixed(2)}
${ansi([1,32])}hk${ansi()}:(t=${Math.ceil(ns.hackAnalyzeThreads(server, money))})  ${msToTime(ns.getHackTime(server))} ${ansi([1,32])}gr${ansi()}:(t=${Math.ceil(ns.growthAnalyze(server, maxMoney / money))}) ${msToTime(ns.getGrowTime(server))} ${ansi([1,32])}wk${ansi()}:(t=${Math.ceil((sec - minSec) * 20)}) ${msToTime(ns.getWeakenTime(server))}`);
      }
      await ns.sleep(flags.refreshrate);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}