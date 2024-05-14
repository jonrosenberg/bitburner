


export default class BaseIPvGo {
  /** @param {NS} ns **/
  constructor(ns, hostname) {

    this.ns = ns;
  }

  /**
   * Shows if each point on the board is a valid move for the player.

The true/false validity of each move can be retrieved via the X and Y coordinates of the move.

const validMoves = ns.go.analysis.getValidMoves();

const moveIsValid = validMoves[x][y];
@remarks Note that the [0][0] point is shown on the bottom-left on the visual board (as is traditional), and each string represents a vertical column on the board. In other words, the printed example above can be understood to be rotated 90 degrees clockwise compared to the board UI as shown in the IPvGO subnet tab.
   */
  get validMoves() { return this.ns.go.analysis.getValidMoves() }
  /** Returns the name of the opponent faction in the current subnet. */
  get opponent() { return this.ns.go.getOpponent() }
  /** Retrieves a simplified version of the board state. "X" represents black pieces, "O" white, and "." empty points. "#" are dead nodes that are not part of the subnet. (They are not territory nor open nodes.)

For example, a 5x5 board might look like this:

[
 "XX.O.",
 "X..OO",
 ".XO..",
 "XXO.#",
 ".XO.#",
]
Each string represents a vertical column on the board, and each character in the string represents a point.

Traditional notation for Go is e.g. "B,1" referring to second ("B") column, first rank. This is the equivalent of index [1][0].

Note that the [0][0] point is shown on the bottom-left on the visual board (as is traditional), and each string represents a vertical column on the board. In other words, the printed example above can be understood to be rotated 90 degrees clockwise compared to the board UI as shown in the IPvGO subnet tab.

@remarks — RAM cost: 4 GB */
  get boardState() { return this.ns.go.getBoardState() }
  get boardStateStr() { return this.rotateArray90(this.boardState, false).join("\n") }
  get disputedTerritory() {
    this.validMoves
    this.opponent
    this.boardState
  }

  /**
   * Finds all groups of connected pieces, or empty space groups
   * @return {Object[][]} pointState
   */
  get chains() { return this.ns.go.analysis.getChains() }
  get chainsStr() { return this.rotateArray90(this.chains, false).join("\n") }
  get controlledEmptyNodes() { return this.ns.go.analysis.getControlledEmptyNodes() }
  get controlledEmptyNodesStr() { return this.rotateArray90(this.controlledEmptyNodes, false).join("\n") }
  get liberties() { return this.ns.go.analysis.getLiberties() }
  get libertiesStr() { return this.rotateArray90(this.liberties, false).join("\n") }
  isValidMove(x, y) { return this.validMoves[x][y] }

  neighbors(board, x, y) {
    return {
      north: board[x]?.[y + 1],
      east: board[x + 1]?.[y],
      south: board[x]?.[y - 1],
      west: board[x - 1]?.[y],
    };
  }

  rotateArray90(arr, clockwise = false) {
    // Get the dimensions of the input array
    const rows = arr.length, cols = arr[0].length;
    // padding
    var pad = (n, z = 2) => ('  ' + n).slice(-z);
    // Rotate the elements and convert each row array back to a string
    return Array.from({ length: cols }, (_, j) =>
      Array.from({ length: rows }, (_, i) => {
        let char = pad(clockwise ? arr[rows - 1 - i][j] : arr[i][cols - 1 - j]);
        return char !== null ? char : '#';
      }).join(' ')
    );
  }
  


}