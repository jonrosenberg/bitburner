/** @param {NS} ns */
function recursiveScan(ns, parent, server, target, route) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }
    return false;
}
/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    let route = [];
    let server = args._[0];
    let view_path_only = args._[1];
    if (!server || args.help) {
        ns.tprint("This script helps you find a server on the network and shows you the path to get to it.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    recursiveScan(ns, '', 'home', server, route);
    if(!view_path_only){
      ns.tprint("connect ", route.join("; connect "), "; backdoor")
    } else {
      for (const i in route) {
          await ns.sleep(100);
          const extra = i > 0 ? "└ " : "";
          ns.tprint(`${" ".repeat(i)}${extra}${route[i]}`);
      }
    }
}

export function autocomplete(data, args) {
    return data.servers;
}
