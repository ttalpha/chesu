import {
  BOARD_SIZE,
  FIRST_BLACK_PAWN_ROW,
  FIRST_WHITE_PAWN_ROW,
} from "../constants";
import { CellState, Color, Piece } from "../types";
import { detectChecks } from "./check-king-safety";
import { isOutOfBound, isSameColor } from "./checks";
import { produce } from "immer";

interface MovesGeneratorInput {
  board: CellState[][];
  color: Color;
  currentPosition: [number, number];
  kingPosition: [number, number];
}

/**
  @todo Detect checkmate
  * See if the king is being checked
  * Exhaustively generate all valid moves of all pieces
  * If there are none, then it's a checkmate
  */

/**
  @description Prevent a piece from moving when it is being pinned with a king.
  * For each loop, create a temporary board and try moving in the temp board,
  * see if the king in check in the temporary board.
  * If in check, then don't add the current move to the list of valid moves.
  * After each iteration, reset the temporary board to the original board
  */
const addMovesIfNotPinned = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number],
  [newX, newY]: [number, number],
  kingPosition: [number, number]
) => {
  const validMoves: [number, number][] = [];
  if (isOutOfBound([newX, newY]) || isSameColor(board, color, [newX, newY]))
    return validMoves;
  const currentCell = board[x][y];
  const tempBoard = produce(board, (draft) => {
    draft[newX][newY] = currentCell;
    draft[x][y] = null;
  });
  if (!detectChecks(tempBoard, color, kingPosition))
    validMoves.push([newX, newY]);
  return validMoves;
};

const generateRookMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  let validMoves: [number, number][] = [];

  for (let i = x + 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [i, y], kingPosition)
    );
    if (board[i][y]) break;
  }
  for (let i = x - 1; i >= 0; i--) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [i, y], kingPosition)
    );
    if (board[i][y]) break;
  }
  for (let i = y + 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x, i], kingPosition)
    );
    if (board[x][i]) break;
  }
  for (let i = y - 1; i >= 0; i--) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x, i], kingPosition)
    );
    if (board[x][i]) break;
  }
  return validMoves;
};

const generateKnightMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  const validMoves: [number, number][] = [];
  return validMoves.concat(
    addMovesIfNotPinned(board, color, [x, y], [x + 2, y - 1], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x + 2, y + 1], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x - 2, y - 1], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x - 2, y + 1], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x + 1, y - 2], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x + 1, y + 2], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x - 1, y - 2], kingPosition),
    addMovesIfNotPinned(board, color, [x, y], [x - 1, y + 2], kingPosition)
  );
};

const generateBishopMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  let validMoves: [number, number][] = [];
  for (let i = 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x + i, y + i], kingPosition)
    );
    if (!isOutOfBound([x + i, y + i]) && board[x + i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x + i, y - i], kingPosition)
    );
    if (!isOutOfBound([x + i, y - i]) && board[x + i][y - i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x - i, y + i], kingPosition)
    );
    if (!isOutOfBound([x - i, y + i]) && board[x - i][y + i]) break;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x - i, y - i], kingPosition)
    );
    if (!isOutOfBound([x - i, y - i]) && board[x - i][y - i]) break;
  }
  return validMoves;
};

const generateQueenMoves = (movesGeneratorInput: MovesGeneratorInput) => {
  return generateRookMoves(movesGeneratorInput).concat(
    generateBishopMoves(movesGeneratorInput)
  );
};

const generateKingMoves = ({
  board,
  color,
  currentPosition: [x, y],
}: MovesGeneratorInput) => {
  const validMoves: [number, number][] = [];
  return validMoves.concat(
    addMovesIfNotPinned(board, color, [x, y], [x - 1, y], [x - 1, y]),
    addMovesIfNotPinned(board, color, [x, y], [x + 1, y], [x + 1, y]),
    addMovesIfNotPinned(board, color, [x, y], [x - 1, y - 1], [x - 1, y - 1]),
    addMovesIfNotPinned(board, color, [x, y], [x - 1, y + 1], [x - 1, y + 1]),
    addMovesIfNotPinned(board, color, [x, y], [x, y - 1], [x, y - 1]),
    addMovesIfNotPinned(board, color, [x, y], [x, y + 1], [x, y + 1]),
    addMovesIfNotPinned(board, color, [x, y], [x + 1, y - 1], [x + 1, y - 1]),
    addMovesIfNotPinned(board, color, [x, y], [x + 1, y + 1], [x + 1, y + 1])
  );
};

const generatePawnMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  let validMoves: [number, number][] = [];
  if (color === Color.Black) {
    if (x === FIRST_BLACK_PAWN_ROW && !board[x + 2][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 2, y], kingPosition)
      );
    if (isSameColor(board, Color.White, [x + 1, y - 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y - 1], kingPosition)
      );
    if (isSameColor(board, Color.White, [x + 1, y + 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y + 1], kingPosition)
      );
    if (!isOutOfBound([x + 1, y]) && !board[x + 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y], kingPosition)
      );
  } else {
    if (x === FIRST_WHITE_PAWN_ROW && !board[x - 2][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 2, y], kingPosition)
      );
    if (isSameColor(board, Color.Black, [x - 1, y - 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y - 1], kingPosition)
      );
    if (isSameColor(board, Color.Black, [x - 1, y + 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y + 1], kingPosition)
      );
    if (!isOutOfBound([x - 1, y]) && !board[x - 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y], kingPosition)
      );
  }
  return validMoves;
};

export const generateMoves = (
  movesGeneratorInput: MovesGeneratorInput,
  piece: Piece
): [number, number][] => {
  switch (piece) {
    case Piece.Rook:
      return generateRookMoves(movesGeneratorInput);
    case Piece.Knight:
      return generateKnightMoves(movesGeneratorInput);
    case Piece.Bishop:
      return generateBishopMoves(movesGeneratorInput);
    case Piece.Queen:
      return generateQueenMoves(movesGeneratorInput);
    case Piece.King:
      return generateKingMoves(movesGeneratorInput);
    case Piece.Pawn:
      return generatePawnMoves(movesGeneratorInput);
    default:
      throw new Error("Piece not found");
  }
};
