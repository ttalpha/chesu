import { generateMoves } from "./generate-moves";
import { BOARD_SIZE } from "../constants";
import { CellState, Color, Piece } from "../types";
import { isOutOfBound, isSameColor } from "./checks";
import { getPiecesDirection } from "./pieces-directions";

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

const detectChecksHorizontallyAndVertically = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (const [dx, dy] of getPiecesDirection(Piece.Rook, kingColor))
    for (let i = 1; i < BOARD_SIZE; i++) {
      const currentPosition: [number, number] = [x + dx * i, y + dy * i];
      if (
        isOutOfBound(currentPosition) ||
        isSameColor(board, kingColor, currentPosition)
      )
        break;
      const [newX, newY] = currentPosition;
      if (!board[newX][newY]) continue;
      if (![Piece.Rook, Piece.Queen].includes(board[newX][newY]!.piece)) break;
      else return true;
    }

  return false;
};

const detectChecksDiagonally = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (const [dx, dy] of getPiecesDirection(Piece.Bishop, kingColor))
    for (let i = 1; i < BOARD_SIZE; i++) {
      const currentPosition: [number, number] = [x + dx * i, y + dy * i];
      if (
        isOutOfBound(currentPosition) ||
        isSameColor(board, kingColor, currentPosition)
      )
        break;
      const [newX, newY] = currentPosition;
      if (!board[newX][newY]) continue;
      if (![Piece.Bishop, Piece.Queen].includes(board[newX][newY]!.piece))
        break;
      else return true;
    }
  return false;
};

const detectChecksByKnight = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  const [x, y] = kingPosition;
  for (const [knightDx, knightDy] of getPiecesDirection(
    Piece.Knight,
    kingColor
  ))
    if (
      checkPiece(board, kingColor, [x + knightDx, y + knightDy], Piece.Knight)
    )
      return true;
  return false;
};

const detectChecksByPawn = (
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

const detectControlsByEnemyKing = (
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
  return (
    detectChecksHorizontallyAndVertically(board, kingColor, kingPosition) ||
    detectChecksDiagonally(board, kingColor, kingPosition) ||
    detectChecksByKnight(board, kingColor, kingPosition) ||
    detectChecksByPawn(board, kingColor, kingPosition) ||
    detectControlsByEnemyKing(board, kingColor, kingPosition)
  );
};

export const detectCheckmate = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  if (!detectChecks(board, kingColor, kingPosition)) return false;
  for (let i = 0; i < BOARD_SIZE; i++)
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j] || !isSameColor(board, kingColor, [i, j])) continue;
      const validMoves = generateMoves(
        {
          board,
          color: kingColor,
          currentPosition: [i, j],
          kingPosition,
        },
        board[i][j]!.piece
      );
      if (validMoves.length > 0) return false;
    }
  return true;
};
