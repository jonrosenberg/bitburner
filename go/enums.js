export let GoOpponent
;(function(GoOpponent) {
  GoOpponent["none"] = "No AI"
  GoOpponent["Netburners"] = "Netburners"
  GoOpponent["SlumSnakes"] = "Slum Snakes"
  GoOpponent["TheBlackHand"] = "The Black Hand"
  GoOpponent["Tetrads"] = "Tetrads"
  GoOpponent["Daedalus"] = "Daedalus"
  GoOpponent["Illuminati"] = "Illuminati"
  GoOpponent["w0r1d_d43m0n"] = "????????????"
})(GoOpponent || (GoOpponent = {}))

export let GoColor
;(function(GoColor) {
  GoColor["white"] = "White"
  GoColor["black"] = "Black"
  GoColor["empty"] = "Empty"
})(GoColor || (GoColor = {}))

export let GoValidity
;(function(GoValidity) {
  GoValidity["pointBroken"] =
    "That node is offline; a piece cannot be placed there"
  GoValidity["pointNotEmpty"] = "That node is already occupied by a piece"
  GoValidity["boardRepeated"] = "It is illegal to repeat prior board states"
  GoValidity["noSuicide"] =
    "It is illegal to cause your own pieces to be captured"
  GoValidity["notYourTurn"] = "It is not your turn to play"
  GoValidity["gameOver"] = "The game is over"
  GoValidity["invalid"] = "Invalid move"
  GoValidity["valid"] = "Valid move"
})(GoValidity || (GoValidity = {}))

export let GoPlayType
;(function(GoPlayType) {
  GoPlayType["move"] = "move"
  GoPlayType["pass"] = "pass"
  GoPlayType["gameOver"] = "gameOver"
})(GoPlayType || (GoPlayType = {}))
