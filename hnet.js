function range(size, startAt = 0){
  return [...Array(size).keys()].map(i => i+startAt);
}
/** @param {NS} ns */
export async function main(ns) {
  // purches hacknet servers to meet a min requirment
  // to get access to Netburners faction

  // 8 servers
  // 100 levels

  
  let totalLevels = 0;
  while (totalLevels < 100){  
    let nodes = range(ns.hacknet.numNodes());
    totalLevels = nodes.reduce((a,b) => a + ns.hacknet.getNodeStats(b).level, 0);
    try{
      nodes.filter(i => ns.hacknet.getNodeStats(i).level < 13).forEach(i => ns.hacknet.upgradeLevel(i, 1));
    } catch {}

    if (nodes.length < 8){
      try {
        ns.hacknet.purchaseNode(); 
      } catch {}
    }
    await ns.sleep(1);
  }

  ns.tail() 
}