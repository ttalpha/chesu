import { BOARD_SIZE } from "../constants";
import { CellState, Color, Piece } from "../types";
import { isOutOfBound, isSameColor } from "./checks";

const checkColumns = (
  board: CellState[][],
  kingColor: Color,
  [x, y]: [number, number]
) => {
  if (isOutOfBound([x, y]) || !board[x][y]) return false;
  return [Piece.Rook, Piece.Queen].includes(board[x][y]!.piece);
};

const checkDiagonals = (board: CellState[][], [x, y]: [number, number]) => {
  if (isOutOfBound([x, y]) || !board[x][y]) return false;
  return [Piece.Queen, Piece.Bishop].includes(board[x][y]!.piece);
};

const checkPiece = (
  board: CellState[][],
  kingColor: Color,
  [x, y]: [number, number],
  piece: Piece
) => {
  if (
    isOutOfBound([x, y]) ||
    !board[x][y] ||
    isSameColor(board, kingColor, [x, y])
  )
    return false;
  return board[x][y]!.piece === piece;
};

const checkIfCheckedHorizontally = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = y - 1; i >= 0; i--) {
    if (isSameColor(board, kingColor, [x, i])) break;
    if (checkColumns(board, kingColor, [x, i])) return true;
  }

  for (let i = y + 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [x, i])) break;
    if (checkColumns(board, kingColor, [x, i])) return true;
  }
  return false;
};

const checkIfCheckedVertically = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = x - 1; i >= 0; i--) {
    if (isSameColor(board, kingColor, [i, y])) break;
    if (checkColumns(board, kingColor, [i, y])) return true;
  }
  for (let i = x + 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [i, y])) break;
    if (checkColumns(board, kingColor, [i, y])) return true;
  }
  return false;
};

const checkIfCheckedDiagonally = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [x + i, y + i])) break;
    if (checkDiagonals(board, [x + i, y + i])) return true;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [x - i, y + i])) break;
    if (checkDiagonals(board, [x - i, y + i])) return true;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [x - i, y - i])) break;
    if (checkDiagonals(board, [x - i, y - i])) return true;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    if (isSameColor(board, kingColor, [x + i, y - i])) break;
    if (checkDiagonals(board, [x + i, y - i])) return true;
  }
  return false;
};

const checkIfCheckedByKnight = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  return (
    checkPiece(board, kingColor, [x + 2, y + 1], Piece.Knight) ||
    checkPiece(board, kingColor, [x + 2, y - 1], Piece.Knight) ||
    checkPiece(board, kingColor, [x - 2, y + 1], Piece.Knight) ||
    checkPiece(board, kingColor, [x - 2, y - 1], Piece.Knight) ||
    checkPiece(board, kingColor, [x + 1, y + 2], Piece.Knight) ||
    checkPiece(board, kingColor, [x + 1, y - 2], Piece.Knight) ||
    checkPiece(board, kingColor, [x - 1, y + 2], Piece.Knight) ||
    checkPiece(board, kingColor, [x - 1, y - 2], Piece.Knight)
  );
};

const checkIfCheckedByPawn = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  if (kingColor === Color.White)
    return (
      checkPiece(board, kingColor, [x - 1, y - 1], Piece.Pawn) ||
      checkPiece(board, kingColor, [x - 1, y + 1], Piece.Pawn)
    );
  return (
    checkPiece(board, kingColor, [x + 1, y - 1], Piece.Pawn) ||
    checkPiece(board, kingColor, [x + 1, y + 1], Piece.Pawn)
  );
};

const checkIfControlledByEnemyKing = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  return (
    checkPiece(board, kingColor, [x + 1, y - 1], Piece.King) ||
    checkPiece(board, kingColor, [x + 1, y + 1], Piece.King) ||
    checkPiece(board, kingColor, [x - 1, y - 1], Piece.King) ||
    checkPiece(board, kingColor, [x - 1, y + 1], Piece.King) ||
    checkPiece(board, kingColor, [x, y - 1], Piece.King) ||
    checkPiece(board, kingColor, [x, y + 1], Piece.King) ||
    checkPiece(board, kingColor, [x - 1, y], Piece.King) ||
    checkPiece(board, kingColor, [x + 1, y], Piece.King)
  );
};

export const detectChecks = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  console.log({
    checkIfCheckedHorizontally: checkIfCheckedHorizontally(
      board,
      kingColor,
      kingPosition
    ),
  });
  console.log({
    checkIfCheckedVertically: checkIfCheckedVertically(
      board,
      kingColor,
      kingPosition
    ),
  });
  console.log({
    checkIfCheckedDiagonally: checkIfCheckedDiagonally(
      board,
      kingColor,
      kingPosition
    ),
  });
  console.log({
    checkIfCheckedByKnight: checkIfCheckedByKnight(
      board,
      kingColor,
      kingPosition
    ),
  });
  console.log({
    checkIfCheckedByPawn: checkIfCheckedByPawn(board, kingColor, kingPosition),
  });
  console.log({
    checkIfControlledByEnemyKing: checkIfControlledByEnemyKing(
      board,
      kingColor,
      kingPosition
    ),
  });
  return (
    checkIfCheckedHorizontally(board, kingColor, kingPosition) ||
    checkIfCheckedVertically(board, kingColor, kingPosition) ||
    checkIfCheckedDiagonally(board, kingColor, kingPosition) ||
    checkIfCheckedByKnight(board, kingColor, kingPosition) ||
    checkIfCheckedByPawn(board, kingColor, kingPosition) ||
    checkIfControlledByEnemyKing(board, kingColor, kingPosition)
  );
};
