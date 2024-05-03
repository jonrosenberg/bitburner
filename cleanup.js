const argsSchema = [
  ['rm',[]],
  ['v',false],
  ['h',false],
  ['help',false]
];

/** @param {NS} ns **/
export async function main(ns) {

  const options = ns.flags(argsSchema)
  const subs = ns.args[0] ? ns.args[0] : 'Temp'
  options.rm.push(subs)
  if (options.h || options.help) {
    ns.tprint(options);
    printHelp(ns);
    ns.exit();
  }
  for (let subs of options.rm ){
    ns.tprint(`INFO Select ${ns.ls('home', subs).length} files with filenames with substring ${subs}`);
    for (let file of ns.ls('home', subs)) {
      if ( options.rm && !options.v) {      
        ns.tprint((ns.rm(file) ? "Removed " : "Failed to remove ") + file);
      } else {
        ns.tprint(file);
      }
    }
    ns.tprint(`INFO Select ${ns.ls('home', subs).length} files with filenames with substring ${subs}`);
  }
}

function printHelp(ns) {
      ns.tprint(`INFO
Usage: cleanup.js [substring='Temp']  [--rm substring2 (--rm substring3 ...etc)] [-h, -help]
Desc: delete files names that match substring
${argsSchema[0][0]}\t= [${argsSchema[0][1]}]\t- list of substrings to delete files
${argsSchema[1][0]}\t= ${argsSchema[1][1]}\t- print files without deleting
${argsSchema[2][0]}\t= ${argsSchema[2][1]}\t- print descriptions of function
    `)
}