import BasePlayer from "if.player";
/** @param {NS} ns */
export async function main(ns) {
  // spawn relevant subscripts given the "status" of the game
  let status = ns.args[0]; // an integer from 0 to ~100 represents how many times we've reset 
  ns.tprint("status: "+status);
    
  let player = new BasePlayer(ns, "player");

  if (player.market.api.fourSigma) {
    ns.tprint("run sbin.market.js");
    ns.run("sbin.market.js");
  }

  if (ns.getServerMoneyAvailable("home") < Math.pow(10,12)) {
    ns.tprint("run hnet.js");
    ns.run("hnet.js");
  } else {
    ns.tprint("run hnet-full.js");
    ns.run("hnet-full.js");
  }

  let pid;
  while (!player.software.ssh) {
    if (!pid) {
      ns.tprint("run maxcash.js");
      pid = ns.run("maxcash.js");
    }
    await ns.sleep(10);
  } 

  try {
    if (pid) { ns.kill(pid); }
  } catch {}
  ns.tprint("run go.js");
  ns.run("go.js");

}