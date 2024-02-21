import { BOARD_SIZE } from "../constants";
import { CellState, Color, Piece } from "../types";
import { isOutOfBound, isSameColor } from "./checks";

export const checkColumns = (
  board: CellState[][],
  kingColor: Color,
  [x, y]: [number, number]
) => {
  if (
    isOutOfBound([x, y]) ||
    !board[x][y] ||
    isSameColor(board, kingColor, [x, y])
  )
    return false;
  return [Piece.Rook, Piece.Queen].includes(board[x][y]!.piece);
};

export const checkDiagonals = (
  board: CellState[][],
  kingColor: Color,
  [x, y]: [number, number]
) => {
  if (
    isOutOfBound([x, y]) ||
    !board[x][y] ||
    isSameColor(board, kingColor, [x, y])
  )
    return false;
  return [Piece.Queen, Piece.Bishop].includes(board[x][y]!.piece);
};

export const checkKnight = (
  board: CellState[][],
  kingColor: Color,
  [x, y]: [number, number]
) => {
  if (
    isOutOfBound([x, y]) ||
    !board[x][y] ||
    isSameColor(board, kingColor, [x, y])
  )
    return false;
  return board[x][y]!.piece === Piece.Knight;
};

export const checkIfCheckedHorizontally = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = y - 1; i >= 0; i--)
    if (checkColumns(board, kingColor, [x, i])) return true;
  for (let i = y + 1; i < BOARD_SIZE; i++)
    if (checkColumns(board, kingColor, [x, i])) return true;
  return false;
};

export const checkIfCheckedVertically = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = x - 1; i >= 0; i--)
    if (checkColumns(board, kingColor, [i, y])) return true;
  for (let i = x + 1; i < BOARD_SIZE; i++)
    if (checkColumns(board, kingColor, [i, y])) return true;
  return false;
};

export const checkIfCheckedDiagonally = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = 1; i < BOARD_SIZE; i++)
    if (checkDiagonals(board, kingColor, [x + i, y + i])) return true;

  for (let i = 1; i < BOARD_SIZE; i++)
    if (checkDiagonals(board, kingColor, [x - i, y + i])) return true;

  for (let i = 1; i < BOARD_SIZE; i++)
    if (checkDiagonals(board, kingColor, [x - i, y - i])) return true;

  for (let i = 1; i < BOARD_SIZE; i++)
    if (checkDiagonals(board, kingColor, [x + i, y - i])) return true;
  return false;
};

export const checkIfCheckedByKnight = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  return (
    checkKnight(board, kingColor, [x + 2, y + 1]) ||
    checkKnight(board, kingColor, [x + 2, y - 1]) ||
    checkKnight(board, kingColor, [x - 2, y + 1]) ||
    checkKnight(board, kingColor, [x - 2, y - 1]) ||
    checkKnight(board, kingColor, [x + 1, y + 2]) ||
    checkKnight(board, kingColor, [x + 1, y - 2]) ||
    checkKnight(board, kingColor, [x - 1, y + 2]) ||
    checkKnight(board, kingColor, [x - 1, y - 2])
  );
};
