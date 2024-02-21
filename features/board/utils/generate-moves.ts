import {
  BOARD_SIZE,
  FIRST_BLACK_PAWN_ROW,
  FIRST_WHITE_PAWN_ROW,
} from "../constants";
import { CellState, Color, Piece } from "../types";
import { isOutOfBound, isSameColor } from "./checks";

/**
  @todo Prevent a piece from moving when it is being pinned with a king
  * For each loop, create a temporary board and try moving in the temp board
  * See if the king in check in the temporary board
  * If in check, then don't add the current move to the list of valid moves
  * After each iteration, reset the temporary board to the original board
  */

/**
  @todo Generate moves that can block the check when the king is in check
  * For each loop, create a temporary board and try moving in the temp board
  * If the king is no longer in check, add that move to the board
  * After each iteration, reset the temporary board to the original board
  */

/**
  @todo Detect checkmate
  * See if the king is being checked
  * Exhaustively generate all valid moves of all pieces
  * If there are none, then it's a checkmate
  */

const generateRookMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];

  for (let i = x + 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [i, y])) validMoves.push([i, y]);
    if (board[i][y]) break;
  }
  for (let i = x - 1; i >= 0; i--) {
    if (!isSameColor(board, color, [i, y])) validMoves.push([i, y]);
    if (board[i][y]) break;
  }
  for (let i = y + 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [x, i])) validMoves.push([x, i]);
    if (board[x][i]) break;
  }
  for (let i = y - 1; i >= 0; i--) {
    if (!isSameColor(board, color, [x, i])) validMoves.push([x, i]);
    if (board[x][i]) break;
  }
  return validMoves;
};

const generateKnightMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];
  if (!isSameColor(board, color, [x + 2, y + 1]))
    validMoves.push([x + 2, y + 1]);
  if (!isSameColor(board, color, [x + 2, y - 1]))
    validMoves.push([x + 2, y - 1]);
  if (!isSameColor(board, color, [x - 2, y + 1]))
    validMoves.push([x - 2, y + 1]);
  if (!isSameColor(board, color, [x - 2, y - 1]))
    validMoves.push([x - 2, y - 1]);
  if (!isSameColor(board, color, [x + 1, y + 2]))
    validMoves.push([x + 1, y + 2]);
  if (!isSameColor(board, color, [x + 1, y - 2]))
    validMoves.push([x + 1, y - 2]);
  if (!isSameColor(board, color, [x - 1, y + 2]))
    validMoves.push([x - 1, y + 2]);
  if (!isSameColor(board, color, [x - 1, y - 2]))
    validMoves.push([x - 1, y - 2]);
  return validMoves;
};

const generateBishopMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [x + i, y + i]))
      validMoves.push([x + i, y + i]);
    if (!isOutOfBound([x + i, y + i]) && board[x + i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [x + i, y - i]))
      validMoves.push([x + i, y - i]);
    if (!isOutOfBound([x + i, y - i]) && board[x + i][y - i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [x - i, y + i]))
      validMoves.push([x - i, y + i]);
    if (!isOutOfBound([x - i, y + i]) && board[x - i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (!isSameColor(board, color, [x - i, y - i]))
      validMoves.push([x - i, y - i]);
    if (!isOutOfBound([x - i, y - i]) && board[x - i][y - i]) break;
  }
  return validMoves;
};

const generateQueenMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  return generateRookMoves(board, color, [x, y]).concat(
    generateBishopMoves(board, color, [x, y])
  );
};

const generateKingMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];
  if (!isSameColor(board, color, [x - 1, y])) validMoves.push([x - 1, y]);
  if (!isSameColor(board, color, [x - 1, y - 1]))
    validMoves.push([x - 1, y - 1]);
  if (!isSameColor(board, color, [x - 1, y + 1]))
    validMoves.push([x - 1, y + 1]);
  if (!isSameColor(board, color, [x - 1, y])) validMoves.push([x - 1, y]);
  if (!isSameColor(board, color, [x, y - 1])) validMoves.push([x, y - 1]);
  if (!isSameColor(board, color, [x, y + 1])) validMoves.push([x, y + 1]);
  if (!isSameColor(board, color, [x + 1, y - 1]))
    validMoves.push([x + 1, y - 1]);
  if (!isSameColor(board, color, [x + 1, y])) validMoves.push([x + 1, y]);
  if (!isSameColor(board, color, [x + 1, y + 1]))
    validMoves.push([x + 1, y + 1]);
  return validMoves;
};

const generatePawnMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];
  if (color === Color.Black) {
    if (x === FIRST_BLACK_PAWN_ROW && !board[x + 2][y])
      validMoves.push([x + 2, y]);
    const hasLeftEnemyPiece =
      !isOutOfBound([x + 1, y - 1]) &&
      board[x + 1][y - 1]?.color === Color.White;
    const hasRightEnemyPiece =
      !isOutOfBound([x + 1, y + 1]) &&
      board[x + 1][y + 1]?.color === Color.White;
    if (hasLeftEnemyPiece) validMoves.push([x + 1, y - 1]);
    if (hasRightEnemyPiece) validMoves.push([x + 1, y + 1]);
    if (!isOutOfBound([x + 1, y]) && !board[x + 1][y])
      validMoves.push([x + 1, y]);
  } else {
    if (x === FIRST_WHITE_PAWN_ROW && !board[x - 2][y])
      validMoves.push([x - 2, y]);
    const hasLeftEnemyPiece =
      !isOutOfBound([x - 1, y - 1]) &&
      board[x - 1][y - 1]?.color === Color.Black;

    const hasRightEnemyPiece =
      !isOutOfBound([x - 1, y + 1]) &&
      board[x - 1][y + 1]?.color === Color.Black;
    if (hasLeftEnemyPiece) validMoves.push([x - 1, y - 1]);
    if (hasRightEnemyPiece) validMoves.push([x - 1, y + 1]);
    if (!isOutOfBound([x - 1, y]) && !board[x - 1][y])
      validMoves.push([x - 1, y]);
  }
  return validMoves;
};

export const generateMoves = (
  board: CellState[][],
  color: Color,
  piece: Piece,
  currentPosition: [number, number]
): [number, number][] => {
  switch (piece) {
    case Piece.Rook:
      return generateRookMoves(board, color, currentPosition);
    case Piece.Knight:
      return generateKnightMoves(board, color, currentPosition);
    case Piece.Bishop:
      return generateBishopMoves(board, color, currentPosition);
    case Piece.Queen:
      return generateQueenMoves(board, color, currentPosition);
    case Piece.King:
      return generateKingMoves(board, color, currentPosition);
    case Piece.Pawn:
      return generatePawnMoves(board, color, currentPosition);
    default:
      throw new Error("Piece not found");
  }
};
