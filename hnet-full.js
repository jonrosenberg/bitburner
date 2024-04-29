import BasePlayer from "if.player";

/** @param {NS} ns */
export async function main(ns) {
  let player = new BasePlayer(ns, "player");
  let runtime = ns.args[0];
  if (runtime) {
    runtime *= 1000;
  } else { runtime = 100000000000; }
  const getProd = (level, ram, cores) => (level * 1.5) * Math.pow(1.035, ram - 1) * ((cores + 5) / 6);

  let start_time = new Date().valueOf();
  let time = new Date().valueOf();
  ns.print(time)
  while (time < start_time + runtime) {
    time = new Date().valueOf();
    if (!ns.hacknet.numNodes()) {
      while (ns.getmoney < ns.hacknet.getPurchaseNodeCost()) {
        ns.print("player.money < ns.hacknet.getPurchaseNodeCost()");
        await ns.sleep(1);
      }
      ns.hacknet.purchaseNode();
    }

    let currentNodeStats = [];
    const mults = ns.getHacknetMultipliers();
    let nodeValue = getProd(10, 1, 1) * mults.production;
		let nodeCost = ns.hacknet.getPurchaseNodeCost()
    
    currentNodeStats.push({
			value: nodeValue,
			cost:  nodeCost,
			ratio: nodeValue/nodeCost,
			type: "node"
		});
    for (let idx = 0; idx < ns.hacknet.numNodes(); idx++) {
      let {level, ram, cores, production} = ns.hacknet.getNodeStats(idx);
      let levelCost = ns.hacknet.getLevelUpgradeCost(idx, 1);
      let ramCost = ns.hacknet.getRamUpgradeCost(idx, 1);
      let coreCost = ns.hacknet.getCoreUpgradeCost(idx, 1);

      let levelValue = getProd(level + 1, ram, cores) * ns.getHacknetMultipliers().production - production;
      let ramValue   = getProd(level, ram + 1, cores) * ns.getHacknetMultipliers().production - production;
      let coreValue  = getProd(level, ram, cores + 1) * ns.getHacknetMultipliers().production - production;
      currentNodeStats.push({
        value: levelValue,
					cost:  levelCost,
					ratio: levelValue/levelCost,
					index: idx,
					type: "level"
				},{
					value: ramValue,
					cost:  ramCost,
					ratio: ramValue/ramCost,
					index: idx,
					type: "ram"

				},{
					value: coreValue,
					cost:  coreCost,
					ratio: coreValue/coreCost,
					index: idx,
					type: "core"
      });
    }
    currentNodeStats.sort((a,b) => b.ratio - a.ratio);
    let bestUpgrade = currentNodeStats[0];
    while (player.money < bestUpgrade.cost) {
      ns.print("INFO player.money < bestUpgrade.cost");
      ns.print("INFO "+player.money+" < "+bestUpgrade.cost);
      ns.print(bestUpgrade);
      await ns.sleep(1);
    }
    switch(bestUpgrade.type) {
      case "level":
        ns.hacknet.upgradeLevel(bestUpgrade.index, 1);
        break;
      case "ram":
        ns.hacknet.upgradeRam(bestUpgrade.index, 1);
        break;
      case "core":
        ns.hacknet.upgradeCore(bestUpgrade.index, 1);
        break;
      case "node":
        ns.hacknet.purchaseNode();
        break;
    }
    ns.print("time < start_time + runtime");
    ns.print(time+"<"+ start_time + runtime);
    await ns.sleep(1);
  }
}