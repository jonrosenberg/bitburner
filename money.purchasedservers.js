import BasePlayer from "if.player";
import BaseServer from "if.server";
import { dpList } from "lib.utils";

const maxNumServers = 25;
const maxServerPower = 20;
const cost_per_ram = 55000;
let minimumServerPower = 20;
  
const argsSchema = [
  ['all',false],
  ['num',-1],
];

/** @param {NS} ns **/
const powerToRam = (power) => {
	return Math.pow(2, power);
}
const canAffordServer = (player, desired_power) => {
	return (player.money >= cost_per_ram * powerToRam(desired_power))
}
/** @param {NS} ns */
async function doPurchase(ns, player, purchased, desired_power) {
	let highest_number_server = purchased.map(s => s.id.split("-")[1])

	highest_number_server.sort((a,b) => parseInt(b) - parseInt(a))
	if (highest_number_server.length > 0) {
		highest_number_server = parseInt(highest_number_server[0]) + 1
	} else {
		highest_number_server = 0;
	}

	if (canAffordServer(player, desired_power)) {
		ns.tprint("Buying server cluster-", highest_number_server, " of power ", desired_power);
		let s = ns.purchaseServer('cluster-' + highest_number_server, powerToRam(desired_power));
		ns.scp(["bin.hk.js", "bin.wk.js", "bin.gr.js"], s, "home")
		return s
	}
	return null;
}
/** @param {NS} ns */
function sellServer(ns, weakestServer) {
	ns.tprint("Deleting server ", weakestServer.id, " of power ", weakestServer.power)
	return ns.deleteServer(weakestServer.id)
}
/** @param {NS} ns */
async function doPurchaseServer(ns) {
  let servers = [];
	let slist = dpList(ns);
	for (let s of slist) {
		servers.push(new BaseServer(ns, s))
	}

	let player = new BasePlayer(ns, "player");

	while(minimumServerPower > 6 && !canAffordServer(player, minimumServerPower)) {
    --minimumServerPower;
  }

	let purchased = servers.filter(s => s.purchased);

	if (purchased.length < maxNumServers) {
		// purchase a server
		purchased.sort((a,b) => b.power - a.power)

		// gets the highest power server that we own, and then increases that by one
		let desired_power;
		if (purchased.length > 0) {
			desired_power = purchased[0].power + 1
		} else {
			desired_power = minimumServerPower;
		}

		desired_power = Math.min(20, maxServerPower, desired_power);
		let newServer = await doPurchase(ns, player, purchased, desired_power)
		if (newServer) { purchased.push(new BaseServer(ns, newServer)); }
	} else {
		// sell a server if we need to, then purchase a server
		purchased.sort((a,b) => a.power - b.power)
		let weakestServer = purchased[0];
		let desired_power = maxServerPower;
		if (canAffordServer(player, desired_power)) {
			if (weakestServer.power < Math.ceil(maxServerPower * 1.0) ) {
				if (sellServer(ns, weakestServer)) {
					await doPurchase(ns, player, purchased, desired_power)
					servers = [];
					slist = dpList(ns);
					for (let s of slist) {
						servers.push(new BaseServer(ns, s))
					}
					purchased = servers.filter(s => s.purchased);
				}
			}
		}
	}
}

/** @param {NS} ns */
export async function main(ns) {
  const options = ns.flags(argsSchema);
  const totalNumServers = options.num > 0 ? options.num : maxNumServers;
  let numServers = 0;
  do {
    doPurchaseServer(ns);
    ++numServers;
  } while (numServers < totalNumServers && options.all)
}