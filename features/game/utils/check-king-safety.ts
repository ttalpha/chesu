import { generateMoves } from "./generate-moves";
import { BOARD_SIZE } from "../constants";
import { CellState, Color, Move, Piece } from "../types";
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

export const detectControlsByEnemyKing = (
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
    detectChecksByPawn(board, kingColor, kingPosition)
  );
};

const checkNoValidMoves = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
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
  console.log({ row: board[rowToCheck] });
  return !board[rowToCheck][5] && !board[rowToCheck][6];
};

const checkClearanceForQueenSideCastling = (
  board: CellState[][],
  kingColor: Color
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  console.log({ row: board[rowToCheck] });
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
  moves: Move[][]
) => {
  const moveIndex = +(kingColor === Color.Black);
  if (kingColor === Color.Black) moves = moves.slice(0, -1);
  const hasMovedKingOrRookPreviously = moves.some(
    (move) =>
      move[moveIndex].piece === Piece.King ||
      checkRookMoved(move[moveIndex], kingColor, "king")
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
  moves: Move[][]
) => {
  const rowToCheck = +(kingColor === Color.White) * (BOARD_SIZE - 1);
  const moveIndex = +(kingColor === Color.Black);
  if (kingColor === Color.Black) moves = moves.slice(0, -1);
  const hasMovedKingOrRookPreviously = moves.some(
    (move) =>
      move[moveIndex].piece === Piece.King ||
      checkRookMoved(move[moveIndex], kingColor, "queen")
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

export const detectCheckmate = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  return (
    detectChecks(board, kingColor, kingPosition) &&
    checkNoValidMoves(board, kingColor, kingPosition)
  );
};

export const detectStalemate = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  return (
    !detectChecks(board, kingColor, kingPosition) &&
    checkNoValidMoves(board, kingColor, kingPosition)
  );
};
