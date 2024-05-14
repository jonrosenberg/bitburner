/** 
 * https://www.reddit.com/r/Bitburner/comments/sz4pk9/cool_exploit_for_roulette/
 * Math.floor = (number) => { return 1 };Math.random = () => { return 0 };
 * 
 * https://www.reddit.com/r/Bitburner/comments/14qwj52/my_roulette_cheating_script_featuring_both_react/
 * 
 * @param {NS} ns 
 * */
export async function main(ns) {
  const tmpFloor = Math.floor; Math.floor = (number) => { return 1 };
  while (ns.getServerMoneyAvailable('home') < 1e9) {
    await ns.sleep(100);
  }
  Math.floor = tmpFloor; //to prevent the need for a reload

}