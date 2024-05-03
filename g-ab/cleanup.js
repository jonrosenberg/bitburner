/** @param {NS} ns **/
export async function main(ns) {
    for (let file of ns.ls('home', '/Temp/')) {
        ns.print(file)
        ns.print((ns.rm(file) ? "Removed " : "Failed to remove ") + file);
    }
}