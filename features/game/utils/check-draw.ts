import { CellState, Color, DrawReason, Move, Piece } from "../types";
import { checkNoValidMoves, detectChecks } from "./check-king-safety";
import { convertBoardToFen } from "./fen-board";

const detectStalemate = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number]
) => {
  return (
    !detectChecks(board, kingColor, kingPosition) &&
    checkNoValidMoves(board, kingColor, kingPosition)
  );
};

const detectInsufficientMaterial = (board: CellState[][]) => {
  const powerfulPieces = [Piece.Pawn, Piece.Rook, Piece.Queen];
  const pieces = board.flat().filter((cell) => cell !== null);
  if (
    pieces.length <= 3 &&
    pieces.every((piece) => !powerfulPieces.includes(piece.piece))
  )
    return true;
  return false;
};

const detectThreefoldRepetition = (
  fenHistory: Map<string, number>,
  currentBoard: CellState[][]
) => {
  const currentBoardFen = convertBoardToFen(currentBoard);
  return fenHistory.get(currentBoardFen) === 2;
};

const detectFiftyMoveRule = (moves: Move[]) => {
  if (moves.length < 100) return false;
  const lastFiftyMoves = moves.slice(-50);
  return lastFiftyMoves.every(
    (move) => !move.capture && move.piece !== Piece.Pawn
  );
};

export const checkDrawReason = (
  board: CellState[][],
  kingColor: Color,
  kingPosition: [number, number],
  moves: Move[],
  fenHistory: Map<string, number>
) => {
  if (detectStalemate(board, kingColor, kingPosition))
    return DrawReason.Stalemate;
  if (detectInsufficientMaterial(board)) return DrawReason.InsufficientMaterial;
  if (detectThreefoldRepetition(fenHistory, board))
    return DrawReason.ThreefoldRepetition;
  if (detectFiftyMoveRule(moves)) return DrawReason.FiftyMoveRule;
  return null;
};
