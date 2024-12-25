import { BOARD_SIZE } from "../constants";
import { Move, Piece } from "../types";

export const convertCellToPGN = ({
  checkmate,
  check,
  from,
  to,
  piece,
  capture,
  kingSideCastle,
  queenSideCastle,
  promotionPiece,
}: Move) => {
  const checkNotation = check && !checkmate ? "+" : "";
  const checkmateNotation = checkmate ? "#" : "";
  const captureNotation = capture ? "x" : "";
  if (kingSideCastle) return "O-O";
  if (queenSideCastle) return "O-O-O";

  return (
    (piece !== Piece.Pawn ? piece : "") +
    (piece !== Piece.Pawn ? captureNotation : "") +
    (piece === Piece.Pawn && capture
      ? String.fromCharCode(from[1] + 97) + "x"
      : "") +
    String.fromCharCode(to[1] + 97) +
    (BOARD_SIZE - to[0]) +
    (promotionPiece ? "=" + promotionPiece : "") +
    checkNotation +
    checkmateNotation
  );
};
