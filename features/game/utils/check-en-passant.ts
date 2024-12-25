import { EN_PASSANT_ROW } from "../constants";
import { CellState, Color, Move, Piece } from "../types";

export const checkEnPassant = (moves: Move[], [x, y]: [number, number]) => {
  /* Check if the last move was a pawn move of 2 squares
    If the last move was a pawn move of 2 squares, then the current move is a valid en passant move if the following conditions are met:
    1. The last move was a pawn move of 2 squares
    2. The last move was made by the opponent
    3. The last move was made to the adjacent square of the current move
    4. The last move was made to the square that the current move is attacking

  * @params moves: Move[] - The list of moves made in the game
  * @params [x, y]: [number, number] - The current move coordinates
  */
  const lastMove = moves[moves.length - 1];
  if (!lastMove) return false;
  const [fromX, fromY] = lastMove.from;
  const [toX] = lastMove.to;

  return (
    lastMove.piece === Piece.Pawn &&
    Math.abs(fromX - toX) === 2 &&
    toX === x &&
    fromY === y
  );
};

export const isEnPassantMove = (
  board: CellState[][],
  [x, y]: [number, number],
  [newX, newY]: [number, number]
) => {
  /* Check if the current move is a valid en passant move (before moving)
   * @params board: CellState[][] - The current board state
   * @params [x, y]: [number, number] - The current move coordinates
   * @params [newX, newY]: [number, number] - The new move coordinates
   */
  const lastMove = board[x][y];
  if (!lastMove) return false;
  return (
    lastMove.piece === Piece.Pawn &&
    Math.abs(x - newX) === 1 &&
    Math.abs(y - newY) === 1 &&
    ((lastMove.color === Color.White && x === EN_PASSANT_ROW - 1) ||
      (lastMove.color === Color.Black && x === EN_PASSANT_ROW)) &&
    board[x][newY]?.piece === Piece.Pawn &&
    board[x][newY]?.color !== lastMove.color
  );
};
