/** @param {NS} ns **/
export async function main(ns) {
  ns.tail()
  for (let file of ns.ls('home', 'js')) {
    
    ns.print(file);
    // ns.print((ns.rm(file) ? "Removed " : "Failed to remove ") + file);
  }
}