/** @param {NS} ns */
export async function main(ns) {
    const flags = ns.flags([
        ['refreshrate', 200],
        ['help', false],
    ])
    if (flags._.length === 0 || flags.help) {
        ns.tprint("This script helps visualize the money and security of a server.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`)
        return;
    }
    ns.tail();
    ns.disableLog('ALL');
    while (true) {
        const serverId = flags._[0];
        let server = ns.getServer(serverId);
        let player = ns.getPlayer();
        let money = server.moneyAvailable;
        if (money === 0) money = 1;
        const maxMoney = server.moneyMax;
        const minSec = server.minDifficulty;
        const sec = server.hackDifficulty;
        // try {
			  const fHkTime = ns.formulas.hacking.hackTime(server,player);
			  const fGrTime = ns.formulas.hacking.growTime (server,player);
			  const fWkTime = ns.formulas.hacking.weakenTime(server,player);
		    // } catch {
        // }
        ns.clearLog(server);
        ns.print(`${server}:`);
        ns.print(` $_______: \$${ns.formatNumber(money)} / ${ns.formatNumber(maxMoney,3,1000)} (${(money / maxMoney * 100).toFixed(2)}%)`);
        ns.print(` security: +${(sec - minSec).toFixed(2)}`);
        ns.print(` hack____: ${Math.round(fHkTime)==Math.round(fHkTime)} ${ns.tFormat(ns.getHackTime(serverId))} (t=${Math.ceil(ns.hackAnalyzeThreads(serverId, money))})`);
        ns.print(` grow____: ${Math.round(fHkTime*3.2)==Math.round(fGrTime)} ${ns.tFormat(ns.getGrowTime(serverId))} (t=${Math.ceil(ns.growthAnalyze(serverId, maxMoney / money))})`);
        ns.print(` weaken__: ${Math.round(fHkTime*4)==Math.round(fWkTime)} ${ns.tFormat(ns.getWeakenTime(serverId))} (t=${Math.ceil((sec - minSec) * 20)})`);
        await ns.sleep(flags.refreshrate);
    }
}

export function autocomplete(data, args) {
    return data.servers;
}