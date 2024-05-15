
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

  /**
   * Finds all groups of connected pieces, or empty space groups
   * @return {Object[][]} {all:chains[][],player[chains],oppenent[chains]}
   */
  get chains() {
    const chains = this.ns.go.analysis.getChains();
    return {
      all: chains,
      player: this.getUniqueValues(this.getPositions('X', this.boardState), chains),
      oppenent: this.getUniqueValues(this.getPositions('O', this.boardState), chains),
    }
  }

  /**
   * Go/effects/netscriptGoImplementation.ts/getControlledEmptyNodes() <- bitburner-src/src/Go/boardAnalysis/boardAnalysis.ts/getControlledSpace(board) <- getAllPotentialEyes(board, chains, GoColor.white, length * 2)
   */
  get controlledEmptyNodes() { return this.ns.go.analysis.getControlledEmptyNodes() }
  get liberties() { return this.ns.go.analysis.getLiberties() }
  get boardPoints() {
    const points = []
    return Array.from({ length: this.boardState.length }, (_, row) => Array.from({ length: this.boardState[0].length }, (_, col) => this.point(row, col)));
  }
  isValidMove(x, y) { return this.validMoves[x][y] }

  move(point, oldLibertyCount = null, newLibertyCount = null, createsLife = false) {
    return {
      point: PointState,
      oldLibertyCount: oldLibertyCount,
      newLibertyCount: newLibertyCount,
      createsLife: createsLife,
    }
  }
  toPoints(posArr) {
    return Array.from(posArr, (pos) => this.point(pos[0], pos[1]))
  }
  pieceColor(piece) {
    switch (piece) {
      case 'X':
        'Black';
        break;
      case 'O':
        'White';
        break;
      case '#':
        null;
        break;
      case '.':
        'Empty';
    }
  }
  point(x, y) {
    return {
      piece: this.boardState[x][y],
      color: this.pieceColor(this.boardState[x][y]),
      chain: this.chains.all[x][y],
      liberty: this.liberties[x][y],
      validMove: this.validMoves[x][y],
      x: x,
      y: y,
    }
  }
  neighbors(x, y, board = null) {
    return {
      north: board ? board[x]?.[y + 1] : this.boardPoints[x]?.[y + 1],
      east: board ? board[x + 1]?.[y] : this.boardPoints[x + 1]?.[y],
      south: board ? board[x]?.[y - 1] : this.boardPoints[x]?.[y - 1],
      west: board ? board[x - 1]?.[y] : this.boardPoints[x - 1]?.[y],
    };
  }
  // Function to get the positions of key='X'
  getPositions(key, board) {
    const positions = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === key) {
          positions.push([row, col]);
        }
      }
    }
    return positions;
  }
  // Function to get unique values at specific positions
  getUniqueValues(positions, valuesBoard) {
    const valueSet = new Set();
    positions.forEach(([row, col]) => {
      if (valuesBoard[row][col] !== null) valueSet.add(valuesBoard[row][col]);
      // const value = valuesBoard[row][col];
      // if (value !== null) {
      //   valueSet.add(value);
      // }
    });
    return Array.from(valueSet);
  }
  /**
   * Finds all the pieces in the current continuous group, or 'chain'
   *
   * Iteratively traverse the adjacent pieces of the same color to find all the pieces in the same chain,
   * which are the pieces connected directly via a path consisting only of only up/down/left/right
   */
  findAdjacentPointsInChain(x, y) {
    const point = this.point(x, y);
    if (!point) {
      return []
    }
    const checkedPoints = []
    const adjacentPoints = [point]
    const pointsToCheckNeighbors = [point]

    while (pointsToCheckNeighbors.length) {
      const currentPoint = pointsToCheckNeighbors.pop()
      if (!currentPoint) {
        break
      }

      checkedPoints.push(currentPoint)
      const neighbors = this.neighbors(currentPoint.x, currentPoint.y)

        ;[neighbors.north, neighbors.east, neighbors.south, neighbors.west]
          .filter(isNotNull)
          .filter(isDefined)
          .forEach(neighbor => {
            if (
              neighbor &&
              neighbor.color === currentPoint.color &&
              !contains(checkedPoints, neighbor)
            ) {
              adjacentPoints.push(neighbor)
              pointsToCheckNeighbors.push(neighbor)
            }
            checkedPoints.push(neighbor)
          })
    }

    return adjacentPoints
  }



}