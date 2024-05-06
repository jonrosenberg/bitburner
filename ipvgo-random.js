const argsSchema = [
  ['s',0],
  ['o',0],
  ['p',false],
  ['h',false],
  ['r',true]
];

const opponentsNames = ["Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati", "????????????"];
const practiceName = "No Ai"

const boardSize = [5, 7, 9, 13];
/**
 * Choose one of the empty points on the board at random to play
 */
const getRandomMove = (board, validMoves) => {
  const moveOptions = [];
  const size = board[0].length;

  // Look through all the points on the board
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Make sure the point is a valid move
      const isValidMove = validMoves[x][y] === true;
      // Leave some spaces to make it harder to capture our pieces.
      // We don't want to run out of empty node connections!
      const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

      if (isValidMove && isNotReservedSpace) {
        moveOptions.push([x, y]);
      }
    }
  }
  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex] ?? [];
};
/** @param {NS} ns */
export async function main(ns) {
  const options = ns.flags(argsSchema);
  if (options.p || options.o == 7) {
    opponentsNames.push(practiceName);
  }
  let opponent = options.o;

  let result, x, y;
  
  while (true) {
    const board = ns.go.getBoardState();
    const validMoves = ns.go.analysis.getValidMoves();

    const [randX, randY] = getRandomMove(board, validMoves);
    // TODO: more move options

    // Choose a move from our options (currently just "random move")
    x = randX;
    y = randY;

    if (x === undefined) {
      // Pass turn if no moves are found
      result = await ns.go.passTurn();
    } else {
      // Play the selected move
      result = await ns.go.makeMove(x, y);
    }

    // Log opponent's next move, once it happens
    // await ns.go.opponentNextTurn();
    ns.print("ns.go.getOpponent()")
    ns.print(ns.go.getOpponent())
    
    await ns.sleep(200);
    if (result?.type !== "gameOver") {
      ns.print("next move");
    } else {
      if (options.r) { 
        opponent = (opponent+1)%opponentsNames.length;
      }
      ns.go.resetBoardState(opponentsNames[opponent],boardSize[options.s])
    }
    // Keep looping as long as the opponent is playing moves
    
  }

  // TODO: add a loop to keep playing
  // ns.go.resetBoardState()
  // TODO: reset board, e.g. `ns.go.resetBoardState("Netburners", 7)`
}




// /** @param {NS} ns */
// export async function main(ns) {
//   ns.tail();
//   const validMoves = ns.go.analysis.getValidMoves();
//   ns.print("validMoves");
//   ns.print(validMoves);
//   ns.print("ns.go.getBoardState()");
//   ns.print(ns.go.getBoardState());
//   let randMove = getRandomMove(ns.go.getBoardState(), ns.go.analysis.getValidMoves());
//   ns.print("randMove");
//   ns.print(randMove);
//   if (randMove.length == 0) {
//     await ns.go.passTurn();
//   }
//   // if (validMoves[x][y] === true) {
//   //   ns.print(validMoves);
//   // }
// }