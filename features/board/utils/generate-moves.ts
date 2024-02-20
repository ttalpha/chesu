import {
  BOARD_SIZE,
  FIRST_BLACK_PAWN_ROW,
  FIRST_WHITE_PAWN_ROW,
} from "../constants";
import { CellState, Color, Piece } from "../types";

const isSameColor = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  return board[x][y]?.color === color;
};

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
  if (x + 2 < BOARD_SIZE) {
    if (y + 1 < BOARD_SIZE && !isSameColor(board, color, [x + 2, y + 1]))
      validMoves.push([x + 2, y + 1]);
    if (y - 1 >= 0 && !isSameColor(board, color, [x + 2, y - 1]))
      validMoves.push([x + 2, y - 1]);
  }
  if (x - 2 >= 0) {
    if (y + 1 < BOARD_SIZE && !isSameColor(board, color, [x - 2, y + 1]))
      validMoves.push([x - 2, y + 1]);
    if (y - 1 >= 0 && !isSameColor(board, color, [x - 2, y - 1]))
      validMoves.push([x - 2, y - 1]);
  }
  if (x + 1 < BOARD_SIZE) {
    if (y + 2 < BOARD_SIZE && !isSameColor(board, color, [x + 1, y + 2]))
      validMoves.push([x + 1, y + 2]);
    if (y - 2 >= 0 && !isSameColor(board, color, [x + 1, y - 2]))
      validMoves.push([x + 1, y - 2]);
  }

  if (x - 1 >= 0) {
    if (y + 2 < BOARD_SIZE && !isSameColor(board, color, [x - 1, y + 2]))
      validMoves.push([x - 1, y + 2]);
    if (y - 2 >= 0 && !isSameColor(board, color, [x - 1, y - 2]))
      validMoves.push([x - 1, y - 2]);
  }
  return validMoves;
};

const generateBishopMoves = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  const validMoves: [number, number][] = [];
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (x + i >= BOARD_SIZE || y + i >= BOARD_SIZE) break;
    if (!isSameColor(board, color, [x + i, y + i]))
      validMoves.push([x + i, y + i]);
    if (board[x + i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (x + i >= BOARD_SIZE || y - i < 0) break;
    if (!isSameColor(board, color, [x + i, y - i]))
      validMoves.push([x + i, y - i]);
    if (board[x + i][y - i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (x - i < 0 || y + i >= BOARD_SIZE) break;
    if (!isSameColor(board, color, [x - i, y + i]))
      validMoves.push([x - i, y + i]);
    if (board[x - i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (x - i < 0 || y - i < 0) break;
    if (!isSameColor(board, color, [x - i, y - i]))
      validMoves.push([x - i, y - i]);
    if (board[x - i][y - i]) break;
  }
  console.log({
    validMoves,
  });
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
  if (x > 0 && !isSameColor(board, color, [x - 1, y]))
    validMoves.push([x - 1, y]);
  if (x > 0 && !isSameColor(board, color, [x - 1, y - 1]))
    validMoves.push([x - 1, y - 1]);
  if (x > 0 && !isSameColor(board, color, [x - 1, y + 1]))
    validMoves.push([x - 1, y + 1]);
  if (x > 0 && !isSameColor(board, color, [x - 1, y]))
    validMoves.push([x - 1, y]);
  if (y > 0 && !isSameColor(board, color, [x, y - 1]))
    validMoves.push([x, y - 1]);
  if (y + 1 < BOARD_SIZE && !isSameColor(board, color, [x, y + 1]))
    validMoves.push([x, y + 1]);
  if (x + 1 < BOARD_SIZE && y > 0 && !isSameColor(board, color, [x + 1, y - 1]))
    validMoves.push([x + 1, y - 1]);
  if (
    x + 1 < BOARD_SIZE &&
    y + 1 < BOARD_SIZE &&
    !isSameColor(board, color, [x + 1, y + 1])
  )
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
    if (x + 1 < BOARD_SIZE) {
      const hasLeftEnemyPiece =
        y - 1 >= 0 &&
        board[x + 1][y - 1] &&
        board[x + 1][y - 1]?.color === Color.White;
      const hasRightEnemyPiece =
        y + 1 < BOARD_SIZE &&
        board[x + 1][y + 1] &&
        board[x + 1][y + 1]?.color === Color.White;
      if (hasLeftEnemyPiece) validMoves.push([x + 1, y - 1]);
      if (hasRightEnemyPiece) validMoves.push([x + 1, y + 1]);
      if (!board[x + 1][y]) validMoves.push([x + 1, y]);
    }
  } else {
    if (x === FIRST_WHITE_PAWN_ROW && !board[x - 2][y])
      validMoves.push([x - 2, y]);
    if (x - 1 >= 0) {
      const hasLeftEnemyPiece =
        y - 1 >= 0 &&
        board[x - 1][y - 1] &&
        board[x - 1][y - 1]?.color === Color.Black;

      const hasRightEnemyPiece =
        y + 1 < BOARD_SIZE &&
        board[x - 1][y + 1] &&
        board[x - 1][y + 1]?.color === Color.Black;
      if (hasLeftEnemyPiece) validMoves.push([x - 1, y - 1]);
      if (hasRightEnemyPiece) validMoves.push([x - 1, y + 1]);
      if (!board[x - 1][y]) validMoves.push([x - 1, y]);
    }
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
