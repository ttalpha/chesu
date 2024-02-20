import { Piece } from "../types";

export const getPieceName = (piece: Piece) => {
  switch (piece) {
    case Piece.Rook:
      return "rook";
    case Piece.Knight:
      return "knight";
    case Piece.Bishop:
      return "bishop";
    case Piece.Queen:
      return "queen";
    case Piece.King:
      return "king";
    case Piece.Pawn:
      return "pawn";
    default:
      throw new Error("Cannot get piece name because it is not found");
  }
};
