import BaseIPvGo from "./if.ipvgo"

export default class AiIPvGo extends BaseIPvGo {
  /** @param {NS} ns */
  constructor(ns) {
    super();
    this.ns = ns;
  }
  
  /**
   * Get a list of all eyes, grouped by the chain they are adjacent to
   * https://github.com/bitburner-official/bitburner-src/blob/9dc3b22919b7666c2a2dde3f3bb710f87412b322/src/Go/boardAnalysis/boardAnalysis.ts#L277
   */
  getAllEyes() {
    this.getAllEyesByChainId();
    return [];
  }
  /**
  Find all empty point groups where either:
  * all of its immediate surrounding player-controlled points are in the same continuous chain, or
  * it is completely surrounded by some single larger chain and the edge of the board

  Eyes are important, because a chain of pieces cannot be captured if it fully surrounds two or more eyes.
  https://github.com/bitburner-official/bitburner-src/blob/9dc3b22919b7666c2a2dde3f3bb710f87412b322/src/Go/boardAnalysis/boardAnalysis.ts#L239
 */
  getAllEyesByChainId() {
    return [];
  }
  get moveCapture() {
    const surroundMove = retrieveMoveOption("surround");
    return surroundMove && surroundMove?.newLibertyCount === 0 ? surroundMove : null;
  }

  get moveSurround() {
    enemyChains = this.chains.oppenent
    // enemyChains and availableSpaces exist
    const availableSpaces = this.findDisputedTerritory(true)
    if (!enemyChains.length || !availableSpaces.length) {
      return null;
    }


    // enemyLiberties
    let enemyLibertiesPos = []
    enemyChains.forEach((chainId) => enemyLibertiesPos = enemyLibertiesPos.concat(this.getPositions(chainId, this.chains.all)));
    const enemyLiberties = [];
    enemyLibertiesPos.forEach(([row, col]) => enemyLiberties.push(this.point(row, col)))

    const captureMoves = [];
    const atariMoves = [];
    const surroundMoves = [];

    enemyLiberties.forEach((move) => {

    });
  }

  /**
   * First prioritizes capturing of opponent pieces.
   * Then, preventing capture of their own pieces.
   * Then, creating "eyes" to solidify their control over the board
   * Then, finding opportunities to capture on their next move
   * Then, blocking the opponent's attempts to create eyes
   * Finally, will match any of the predefined local patterns indicating a strong move.
   */
  get getIlluminatiPriorityMove() {
    if (this.moveCapture()) {
      ns.print("capture");
    }
  }



}
