const opponentsNames = ["No AI", "Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati", "????????????"];
const boardSize = [5, 7, 9, 13];

/**
 * A node in the MCTS tree.
 */
class Node {
  constructor(board, validMoves) {
    this.board = board;
    this.validMoves = validMoves;
    this.children = [];
    this.score = 0;
    this.visits = 0;
  }

  /**
   * Check if the node is a leaf node.
   */
  isLeaf() {
    return this.children.length === 0;
  }

  /**
   * Select a child node using the UCB1 formula.
   */
  selectChild() {
    let bestChild = null;
    let bestScore = -Infinity;
    for (const child of this.children) {
      const score = child.score / child.visits + Math.sqrt(2 * Math.log(this.visits) / child.visits);
      if (score > bestScore) {
        bestChild = child;
        bestScore = score;
      }
    }
    return bestChild;
  }

  /**
   * Expand the node by simulating a game from the current position.
   */
  expand(ns) {
    // Choose a random valid move
    const move = this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
    // Make the move on the board
    const simulatedBoard = JSON.parse(JSON.stringify(this.board));
    simulatedBoard.splice(move[0], move[1], 1);// simulatedBoard[move[0]][move[1]] = 1; // 
    // Get the valid moves for the new position
    const validMoves = ns.go.analysis.getValidMoves(simulatedBoard);
    // Create a new child node for the new position
    const child = new Node(simulatedBoard, validMoves);
    // Add the child node to the list of children
    this.children.push(child);
  }

  /**
   * Backpropagate the results of the simulation up the tree.
   */
  backpropagate() {
    // Update the score and visits of the node
    this.score += 1;
    this.visits += 1;
    // Backpropagate the results up the tree
    if (this.parent) {
      this.parent.backpropagate();
    }
  }
}

/**
 * Choose the best move from the list of valid moves using MCTS.
 */
const getBestMove = (ns, board, validMoves) => {
  const size = board[0].length;
  let bestMove = [];
  let bestScore = -Infinity;
  ns.print("run bestMove");
  // Create a root node for the MCTS tree
  let rootNode = null;
  if (board && validMoves) {
        rootNode = new Node(board, validMoves);
  } else {
      // Handle the case when either board or validMoves is null
      // You can choose to return a default move or throw an error
      // depending on your requirements
      return bestMove;
  }

  // Perform MCTS for a fixed number of iterations
  for (let i = 0; i < 1000; i++) {
    // Select a leaf node from the tree
    let node = rootNode;
    while (!node.isLeaf()) {
      node = node.selectChild();
    }
    // Expand the leaf node by simulating a game from the current position
    node.expand(ns);
    // Backpropagate the results of the simulation up the tree
    node.backpropagate();
  }
  // Choose the child of the root node with the highest score
  for (const child of rootNode.children) {
    if (child.score > bestScore) {
      bestMove = child.move;
      bestScore = child.score;
    }
  }
  ns.print("found best move");
  ns.print(bestMove);
  return bestMove;
};



/** @param {NS} ns */
export async function main(ns) {
  let result, x, y;

  while (true) {
    // try {
      const board = ns.go.getBoardState();
      const validMoves = ns.go.analysis.getValidMoves();
      // Create a root node for the MCTS tree
      let rootNode = new Node(board, validMoves);
      // Choose the best move from the list of valid moves
      const bestMove = getBestMove(ns, board, validMoves);
      
      // Play the selected move
      ns.print("result");
      ns.print(result);
      if (bestMove.length != 0) {
        const [bestX, bestY] = bestMove;
        result = await ns.go.makeMove(bestX, bestY);
        // Log the move
        ns.print(`Played move: ${bestX}, ${bestY}`);
      } else {
        ns.go.passTurn();
        ns.print("...passing turn");
      }
      // Log opponent's next move, once it happens
      // await ns.go.opponentNextTurn();
      ns.print("Opponent's move:");
      // ns.print(ns.go.getOpponentMove());
    // } catch (error) {
    //   ns.print(`Error: ${error}`);
    // }

    await ns.sleep(200);
    if (result?.type !== "gameOver") {
      ns.print("next move");
    } else {
      ns.go.resetBoardState(opponentsNames[0],boardSize[0])
    }
  }
}
