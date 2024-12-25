import { BOARD_SIZE } from "../constants";
import { CellState, Color, Move, Piece } from "../types";
import { detectChecks } from "./check-king-safety";

export const isCastleMove = (
  board: CellState[][],
  [oldX, oldY]: [number, number],
  [newX, newY]: [number, number]
) => {
  const oldPosition = board[oldX][oldY];
  const kingSideCastle = newY - oldY === 2 && oldPosition?.piece === Piece.King;
  const queenSideCastle =
    newY - oldY === -2 && oldPosition?.piece === Piece.King;
  return { kingSideCastle, queenSideCastle };
};
const checkCastleKingSideSquaresControlled = (
  board: CellState[][],
  kingColor: Color
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  return (
    detectChecks(board, kingColor, [rowToCheck, 5]) ||
    detectChecks(board, kingColor, [rowToCheck, 6])
  );
};

const checkClearanceForKingSideCastling = (
  board: CellState[][],
  kingColor: Color
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  return !board[rowToCheck][5] && !board[rowToCheck][6];
};

const checkClearanceForQueenSideCastling = (
  board: CellState[][],
  kingColor: Color
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  return (
    !board[rowToCheck][1] && !board[rowToCheck][2] && !board[rowToCheck][3]
  );
};

const checkCastleQueenSideSquaresControlled = (
  board: CellState[][],
  kingColor: Color
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  return (
    detectChecks(board, kingColor, [rowToCheck, 1]) ||
    detectChecks(board, kingColor, [rowToCheck, 2]) ||
    detectChecks(board, kingColor, [rowToCheck, 3])
  );
};

const checkRookMoved = (move: Move, color: Color, side: "king" | "queen") => {
  const rowToCheck = +(color === Color.White) * (BOARD_SIZE - 1);
  const sideToCheck = side === "king" ? BOARD_SIZE - 1 : 0;
  return (
    move.piece === Piece.Rook &&
    move.from[0] === rowToCheck &&
    move.from[1] === sideToCheck
  );
};

export const checkCanCastleKingSide = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number],
  moves: Move[]
) => {
  const moveIndex = +(kingColor === Color.Black);
  if (kingColor === Color.Black) moves = moves.slice(0, -1);
  const hasMovedKingOrRookPreviously = moves.some(
    (move, i) =>
      (i & 1) == moveIndex &&
      (move.piece === Piece.King || checkRookMoved(move, kingColor, "king"))
  );
  const anySquaresControlled = checkCastleKingSideSquaresControlled(
    board,
    kingColor
  );
  const isBeingChecked = detectChecks(board, kingColor, kingPosition);
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  const areSquaresCleared = checkClearanceForKingSideCastling(board, kingColor);

  return (
    !isBeingChecked &&
    !hasMovedKingOrRookPreviously &&
    !anySquaresControlled &&
    areSquaresCleared &&
    board[rowToCheck].at(-1)?.piece === Piece.Rook
  );
};

export const checkCanCastleQueenSide = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number],
  moves: Move[]
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  const moveIndex = +(kingColor === Color.Black);
  if (kingColor === Color.Black) moves = moves.slice(0, -1);
  const hasMovedKingOrRookPreviously = moves.some(
    (move, i) =>
      (i & 1) == moveIndex &&
      (move.piece === Piece.King || checkRookMoved(move, kingColor, "queen"))
  );
  const anySquaresControlled = checkCastleQueenSideSquaresControlled(
    board,
    kingColor
  );
  const isBeingChecked = detectChecks(board, kingColor, kingPosition);
  const areSquaresCleared = checkClearanceForQueenSideCastling(
    board,
    kingColor
  );
  return (
    !isBeingChecked &&
    !hasMovedKingOrRookPreviously &&
    !anySquaresControlled &&
    areSquaresCleared &&
    board[rowToCheck][0]?.piece === Piece.Rook
  );
};
