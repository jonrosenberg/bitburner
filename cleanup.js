/** @param {NS} ns **/
export async function main(ns) {
  ns.tail()
  const subs = ns.args[0] ? ns.args[0] : 'Temp'
  const del = ns.args.length == 2 ? ns.args[1] : 'keep'
  for (let file of ns.ls('home', subs)) {
    
    if (subs == '-h' && ns.args.length == 1 || del == "-h") {
      if(file.split('/').length == 1){
        ns.print((ns.rm(file) ? "Removed " : "Failed to remove ") + file);
      }
    } else if (del == "delete" || del == "-d" || del == "-rm") {      
      ns.print((ns.rm(file) ? "Removed " : "Failed to remove ") + file);
    } else {
      ns.print(file);
    }
  }
}