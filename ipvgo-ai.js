import BaseIPvGo from "./if.ipvgo";

/** @param {NS} ns
 */
export async function main(ns) {
  ns.tail()
  let go = new BaseIPvGo(ns);
  //  = getMoveOptions();
  ns.print("go.boardStateStr")
  ns.print(go.boardStateStr)
  ns.print("go.controlledEmptyNodesStr")
  ns.print(go.controlledEmptyNodesStr)
  ns.print("go.chainsStr")
  ns.print(go.chainsStr)
  ns.print("go.libertiesStr")
  ns.print(go.libertiesStr)
  // ns.print(Object.getOwnPropertyNames(ns.go.analysis))
  // ns.print(ns.go.analysis)
  //ns.print(Object.getOwnPropertyNames(ns))
  //ns.print(ns)
  let input = ''
  let conInput = true;
  let count = 0;
  //ns.print(LocationName)
  // while (count < 100)  {
  //   const input = await ns.prompt("what to print next?",{type:"text"});
  //   ns.print(input);
  //   ns.print(ns)
  //   if(input == "q") { break; }
  //   ++count;
  // } 
  

  // ns.print(go.neighbors(go.boardState,1,1))
  return null;
  
  const result = await ns.go.makeMove(0, 0);
  if (result?.type !== "gameOver") {
      ns.print("next move");
  } else {
  }

}
