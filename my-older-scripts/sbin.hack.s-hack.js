/** @param {NS} ns */
export async function main(ns) {

    let target = ""
    ns.tprint("Number of args: " + ns.args.length);
    for (var i = 0; i < ns.args.length; ++i) {
        ns.tprint(typeof ns.args[i]);
        ns.tprint(ns.args[i]);
        target = ns.args[0];
    }
    if(target.length == 0){
      target = "joesguns"
    }
    // Defines the "target server", which is the server
    // that we're going to hack. In this case, it's "n00dles"
    // const target = ns.getHostname();
    
    ns.tprint("hostname: "+target);
    
    // Defines how much money a server should have before we hack it
    // In this case, it is set to the maximum amount of money.
    // const moneyThresh = ns.getServerMaxMoney(target);
    const moneyThresh = 0.7 * 2700000
    ns.tprint("getServerMaxMoney: "+moneyThresh);
    
    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    // const securityThresh = ns.getServerMinSecurityLevel(target);
    const securityThresh = 5 + 20
    ns.tprint("getServerMinSecurityLevel: "+securityThresh);
    
    // If we have the BruteSSH.exe program, use it to open the SSH Port
    // on the target server
    // if (ns.fileExists("BruteSSH.exe", "home")) {
    //     ns.brutessh(target);
    // }

    // Get root access to target server
    // ns.nuke(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        const serv_security = ns.getServerSecurityLevel(target)
        const serv_money = ns.getServerMoneyAvailable(target)
        if (serv_security > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            // ns.tprint("serv_security: "+serv_security)
            await ns.weaken(target);
        } else if (serv_money < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            // ns.tprint("serv_money: "+serv_money)
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            // ns.tprint("hacking:"+target)
            await ns.hack(target);
        }
    }
}