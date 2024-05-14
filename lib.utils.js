
/**
 * returns an array of servers dynamically
 * @param {NS} ns 
 * @param {string=} current 
 * @param {set=} current 
 * @return {string[]}
 **/
export function dpList(ns, current="home", set=new Set()) {
	let connections = ns.scan(current)
	let next = connections.filter(c => !set.has(c))
	next.forEach(n => {
		set.add(n);
		return dpList(ns, n, set)
	})
	return Array.from(set.keys())
}
/**
 * returns an active Threads
 * @param {NS} ns 
 * @return {number[]} 
 **/
export function runningThreads(ns, current="home") {
  let runWkThreads = 0;
  let runGrThreads = 0;
  let runHkThreads = 0;
  for (let pi of ns.ps("home")) {
    
    switch(pi.filename) {
      case "bin.wk.js":
        runWkThreads += pi.threads;
        break;
      case "bin.gr.js":
        runGrThreads += pi.threads;
        break;
      case "bin.hk.js":
        runHkThreads += pi.threads;
        
        break;
    }
  }
  return [runWkThreads, runGrThreads, runHkThreads]
}
/**
 * get runtime for hk, wk, gr, sh files in milliseconds or str format
 * @param {number} serverHackTime - ns.getHackTime(serverName)
 * @return {Object.<string, number|string>} json of ms and str
 */
export const execRuntime = (serverHackTime) => {
  let results = {};
  Object.entries(bin).forEach((v) => { results[v[1].id] = v[1].id != 'sh' ? {
        ms:(serverHackTime * v[1].runtimeMult), str:msToTime(serverHackTime * v[1].runtimeMult) 
      } : { ms:(v[1].runtime), str:msToTime(v[1].runtime) }});
  return results
}


export class Cacheable {
	constructor(){}
	
	async createEventListener(fieldSet) {
		const embeddedObject = (obj, field) => {
			return obj[field];
		}

		let splitFields = fieldSet.split(".");
		let oldValue;
		while (true) {
			let subObj = this;
			for (let field of splitFields) {
				subObj = embeddedObject(subObj, field);
			}
			if (oldValue != subObj) {
				oldValue = subObj;
				this.updateCache(false);
			}
			await this.ns.asleep(10);
		}
	}
}
