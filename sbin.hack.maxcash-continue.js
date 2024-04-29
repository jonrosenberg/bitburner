
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
    // open all possible ports
    if (!ns.hasRootAccess(server)) {     
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

  while(true){
    let targets = allServers(ns).filter(s => ns.getServerMoneyAvailable (s) > 5000 && s != "home");
    for (let server of servers) {
      for (let target of targets) {
        if(/*server != "home" && */ns.hasRootAccess(server) && ns.hasRootAccess(target) && ns.getServerMaxMoney(target) > 5000){
          if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 3) {
            ns.print("weak");
            let available_threads = threadCount(ns, server, 1.75);
            ns.print(available_threads);
            if (available_threads > 0) {
              ns.exec("bin.wk.js", server, available_threads, target);
            }
          } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
            ns.print("grow");
            let available_threads = threadCount(ns, server, 1.75);
            ns.print(available_threads)
            if (available_threads > 0) {
              
              ns.exec("bin.gr.js", server, available_threads, target);
            }
          } else {
            ns.print("hack");
            let available_threads = threadCount(ns, server, 1.7);
            ns.print(available_threads)
            if (available_threads > 0) {
              ns.exec("bin.hk.js", server, available_threads, target);
            }
          }
        }
      }
      await ns.sleep(10);
    }
  }
  // ns.print(servers)
  ns.print(servers.length)
  ns.tail()
  // ns.tprint("Neighbors of current server."); 
  // let neighbor = ns.scan('home'); 
  
  // for (let i = 0; i < neighbor.length; i++) { 
  //   ns.tprint(neighbor[i]); 
  // } 
  // // All neighbors of n00dles. 
  // const target = "n00dles"; 
  // neighbor = ns.scan(target); 
  // ns.tprintf("Neighbors of %s.", target); 
  // for (let i = 0; i < neighbor.length; i++) { 
  //   ns.tprint(neighbor[i]); 
  // }

  // let i = 0;
  // let sList = ['home'];
  // let sVisited = [];
  // let sListNew = null;
  // let sName = null;
  // let sInfo = null;
  // ns.print("INFO start: ${sList}: "+sList);
  // while(sList.length > 0){
  //   sName = sList.pop();
  //   sVisited.push(sName);
  //   ns.print(sInfo);
  //   sListNew = ns.scan(sName);
  //   sListNew.forEach(elem => {if (!sList.includes(elem) && !sVisited.includes(elem)) {
  //     sList.push(elem);
  //   }});
  //   // execute on select server
  //   // sInfo = ns.getServer(sName);
    


  // }
  
  // ns.print("INFO RESULTS: ");
  // ns.print(sVisited);
  // ns.print(ns.getServer('home'));
  // ns.print(ns.getServer('n00dles'));
  // ns.tail();
}