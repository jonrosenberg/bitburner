import BoardIPvGo from "./if.ipvgo.board";

/** @param {NS} ns
 */
export async function main(ns) {
  ns.tail()
  let go = new BoardIPvGo(ns);
  //  = getMoveOptions();
  
  ns.print("go.boardStateStr")
  ns.print(go.boardState.all)
  ns.print(go.boardStateStr)
  ns.print("go.controlledEmptyNodesStr")
  ns.print(go.controlledEmptyNodes)
  ns.print(go.controlledEmptyNodesStr)
  ns.print("go.chainsStr")
  ns.print(go.chains)
  ns.print(go.chainsStr)
  ns.print("go.libertiesStr")
  ns.print(go.liberties)
  ns.print(go.libertiesStr)
  const x = 0, y = 0;
  ns.print("go.findAdjacentPointsInChain(1,1)")
  ns.print(go.findAdjacentPointsInChain(1,1))
  
  // ns.print(go.neighbors(go.boardState,1,1))
  return null;
  
  const result = await ns.go.makeMove(0, 0);
  if (result?.type !== "gameOver") {
      ns.print("next move");
  } else {
  }

}
