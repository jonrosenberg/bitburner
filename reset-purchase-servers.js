/** @param {NS} ns */
export async function main(ns) {

  let i = 0;
  const PSList = ns.getPurchasedServers();
  ns.tprint(ns.getPurchasedServers().length);
  // ns.printRaw(ns.getPurchasedServers)
  // let totalPS = len(ns.getPurchasedServers);
  while (i < PSList.length){
    
    // ns.renamePurchasedServer(PSList[i],"ps-"+i)
    
    ns.tprint(PSList[i]+" -> "+"ps-"+i);
    ns.killall(PSList[i])
    ns.scp("joe-hack.js", PSList[i]);
    ns.exec("joe-hack.js", PSList[i], 3);
    
    ++i;
  }
  ns.tprint(ns.getPurchasedServerLimit())
}