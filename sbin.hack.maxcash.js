
function allServers(ns, sQueue = ['home']) {
  let allServers = [];
  let server = '';
  while(sQueue.length > 0){
    server = sQueue.pop();
    allServers.push(server);
    ns.scan(server).forEach(elem => {if (!sQueue.includes(elem) && !allServers.includes(elem)) {
      sQueue.push(elem);
    }});
  }
  return allServers;
}

/** @param {NS} ns */
function threadCount(ns, hostname, scriptRam) {
  let threads = 0;
  let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
  threads = free_ram / scriptRam;
  return Math.floor(threads);
}

/** @param {NS} ns */
export async function main(ns) {
  let servers = allServers(ns);
  
  for (let server of servers) {
    ns.scp(["bin.wk.js","bin.gr.js","bin.hk.js"], server, "home");
    
  }

  while(true){
    let targets = allServers(ns).filter(s => ns.getServerMoneyAvailable (s) > 5000 && s != "home");
    for (let server of servers) {
      for (let target of targets) {
        if(ns.hasRootAccess(server) && ns.hasRootAccess(target) && ns.getServerMaxMoney(target) > 5000){
          if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 3) {
            ns.print("weak");
            let available_threads = threadCount(ns, server, 1.75);
            ns.print(available_threads);
            if (available_threads > 0) {
              ns.exec("bin.wk.js", server, available_threads, target);
            }
          } else {
            ns.print("hack");
            let available_threads = threadCount(ns, server, 1.7);
            ns.print(available_threads)
            if (available_threads > 0) {
              ns.exec("bin.hk.js", server, available_threads, target);
            }
          }
        } else {
          // open all possible ports
          try {
            ns.brutessh(server);
            ns.ftpcrack(server);
            ns.relaysmtp(server);
            ns.httpworm(server);
            ns.sqlinject(server);
          } catch {}
          // get root access
          try {
            ns.nuke(server);
          } catch {}
        }
      }
      await ns.sleep(10);
    }
  }
  
}