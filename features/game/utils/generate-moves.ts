import {
  BOARD_SIZE,
  FIRST_BLACK_PAWN_ROW,
  FIRST_WHITE_PAWN_ROW,
} from "../constants";
import { CellState, Color, Move, Piece } from "../types";
import { detectChecks, detectControlsByEnemyKing } from "./check-king-safety";
import { isOutOfBound, isSameColor } from "./checks";
import { produce } from "immer";
import { getPiecesDirection } from "./pieces-directions";
import {
  checkCanCastleKingSide,
  checkCanCastleQueenSide,
} from "./check-castling";
import { checkEnPassant, isEnPassantMove } from "./check-en-passant";

interface MovesGeneratorInput {
  board: CellState[][];
  color: Color;
  currentPosition: [number, number];
  kingPosition: [number, number];
}

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
    if (isEnPassantMove(draft, [newX, newY], [x, y])) draft[x][newY] = null;
    draft[x][y] = null;
  });
  if (
    !detectChecks(tempBoard, color, kingPosition) &&
    !detectControlsByEnemyKing(tempBoard, color, kingPosition)
  )
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

  for (const [dx, dy] of getPiecesDirection(Piece.Rook, color)) {
    for (let i = 1; i < BOARD_SIZE; i++) {
      validMoves = validMoves.concat(
        addMovesIfNotPinned(
          board,
          color,
          [x, y],
          [x + dx * i, y + dy * i],
          kingPosition
        )
      );
      if (
        !isOutOfBound([x + dx * i, y + dy * i]) &&
        board[x + dx * i][y + dy * i]
      )
        break;
    }
  }
  return validMoves;
};

const generateKnightMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  let validMoves: [number, number][] = [];
  for (const [dx, dy] of getPiecesDirection(Piece.Knight, color))
    validMoves = validMoves.concat(
      addMovesIfNotPinned(board, color, [x, y], [x + dx, y + dy], kingPosition)
    );
  return validMoves;
};

const generateBishopMoves = ({
  board,
  color,
  currentPosition: [x, y],
  kingPosition,
}: MovesGeneratorInput) => {
  let validMoves: [number, number][] = [];
  for (const [dx, dy] of getPiecesDirection(Piece.Bishop, color))
    for (let i = 1; i < BOARD_SIZE; i++) {
      validMoves = validMoves.concat(
        addMovesIfNotPinned(
          board,
          color,
          [x, y],
          [x + dx * i, y + dy * i],
          kingPosition
        )
      );
      if (
        !isOutOfBound([x + dx * i, y + dy * i]) &&
        board[x + dx * i][y + dy * i]
      )
        break;
    }
  return validMoves;
};

const generateQueenMoves = (movesGeneratorInput: MovesGeneratorInput) => {
  return generateRookMoves(movesGeneratorInput).concat(
    generateBishopMoves(movesGeneratorInput)
  );
};

const generateKingMoves = (
  { board, color, currentPosition: [x, y] }: MovesGeneratorInput,
  moves: Move[]
) => {
  let validMoves: [number, number][] = [];
  for (const [dx, dy] of getPiecesDirection(Piece.King, color))
    validMoves = validMoves.concat(
      addMovesIfNotPinned(
        board,
        color,
        [x, y],
        [x + dx, y + dy],
        [x + dx, y + dy]
      )
    );
  if (checkCanCastleKingSide(board, color, [x, y], moves))
    validMoves = validMoves.concat([[x, y + 2]]);
  if (checkCanCastleQueenSide(board, color, [x, y], moves))
    validMoves = validMoves.concat([[x, y - 2]]);
  return validMoves;
};

const generatePawnMoves = (
  { board, color, currentPosition: [x, y], kingPosition }: MovesGeneratorInput,
  moves: Move[]
) => {
  let validMoves: [number, number][] = [];
  if (color === Color.Black) {
    if (x === FIRST_BLACK_PAWN_ROW && !board[x + 2][y] && !board[x + 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 2, y], kingPosition)
      );
    for (const [dx, dy] of getPiecesDirection(Piece.Pawn, color)) {
      if (isSameColor(board, Color.White, [x + dx, y + dy]))
        validMoves = validMoves.concat(
          addMovesIfNotPinned(
            board,
            color,
            [x, y],
            [x + dx, y + dy],
            kingPosition
          )
        );
    }
    if (!isOutOfBound([x + 1, y]) && !board[x + 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y], kingPosition)
      );

    if (checkEnPassant(moves, [x, y - 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y - 1], kingPosition)
      );

    if (checkEnPassant(moves, [x, y + 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x + 1, y + 1], kingPosition)
      );
  } else {
    if (x === FIRST_WHITE_PAWN_ROW && !board[x - 2][y] && !board[x - 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 2, y], kingPosition)
      );
    for (const [dx, dy] of getPiecesDirection(Piece.Pawn, color)) {
      if (isSameColor(board, Color.Black, [x + dx, y + dy]))
        validMoves = validMoves.concat(
          addMovesIfNotPinned(
            board,
            color,
            [x, y],
            [x + dx, y + dy],
            kingPosition
          )
        );
    }
    if (!isOutOfBound([x - 1, y]) && !board[x - 1][y])
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y], kingPosition)
      );
    if (checkEnPassant(moves, [x, y - 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y - 1], kingPosition)
      );

    if (checkEnPassant(moves, [x, y + 1]))
      validMoves = validMoves.concat(
        addMovesIfNotPinned(board, color, [x, y], [x - 1, y + 1], kingPosition)
      );
  }
  return validMoves;
};

export const generateMoves = (
  movesGeneratorInput: MovesGeneratorInput,
  piece: Piece,
  moves: Move[] = []
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
      return generateKingMoves(movesGeneratorInput, moves);
    case Piece.Pawn:
      return generatePawnMoves(movesGeneratorInput, moves);
    default:
      throw new Error("Piece not found");
  }
};
