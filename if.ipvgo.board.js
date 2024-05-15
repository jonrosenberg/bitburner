import BaseIPvGo from "./if.ipvgo"

export default class BoardIPvGo extends BaseIPvGo {
  /** @param {NS} ns **/
  constructor(ns, hostname) {
    super();
    this.ns = ns;
  }

  get boardStateStr() { return this.rotateArray90(this.boardState, false).join("\n") }
  get chainsStr() { return this.rotateArray90(this.chains.all, false).join("\n") }
  get controlledEmptyNodesStr() { return this.rotateArray90(this.controlledEmptyNodes, false).join("\n") }
  get libertiesStr() { return this.rotateArray90(this.liberties, false).join("\n") }
  rotateArray90(arr, clockwise = false, ns = null) {
    // Get the dimensions of the input array
    const rows = arr.length, cols = arr[0].length;
    // padding
    var pad = (n, z = 2) => ('  ' + n).slice(-z);
    // Rotate the elements and convert each row array back to a string
    return Array.from({ length: cols }, (_, j) =>
      Array.from({ length: rows }, (_, i) => {
        let char = clockwise ? arr[rows - 1 - i][j] : arr[i][cols - 1 - j];
        return char !== null ? pad(char) : ' #';
      }).join(' ')
    );
  }

  /**
   * For a potential move, determine what the liberty of the point would be if played, by looking at adjacent empty nodes
   * as well as the remaining liberties of neighboring friendly chains
   */
  findEffectiveLibertiesOfNewMove(x, y) { 
    const friendlyChains = this.chains.player;
    //TODO: const neighbors = findAdjacentLibertiesAndAlliesForPoint()
  }


}