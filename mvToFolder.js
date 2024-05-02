/** @param {NS} ns **/
export async function main(ns) {
  ns.tail()
  const subs = ns.args[0] ? ns.args[0] : '';
  const to_folder = ns.args.length == 2 ? ns.args[1] : '/';
  const to_host = ns.args.length == 3 ? ns.args[2] : 'home';
  const commit = ns.args.length == 4 ? ns.args[3] : false;
  for (let file of ns.ls(ns.getHostname(), subs)) {
    const tf = file.split('/');
    const to_file = to_folder+tf[tf.length-1];
    ns.print(tf);
    ns.print(to_file);
    if (commit == "move" || commit == "-m" || commit == "-mv") {
      
      ns.print((ns.mv(to_host, file, to_file) ? "Removed " : "Failed to remove ") + file);
    } else {
      ns.print(`INFO ? ${file} -> ${to_host}@${to_file} `);
    }
  }
}