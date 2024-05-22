import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";

export enum FENChar {
  WhiteRook = "R",
  WhiteKnight = "N",
  WhiteBishop = "B",
  WhiteQueen = "Q",
  WhiteKing = "K",
  WhitePawn = "P",
  BlackRook = "r",
  BlackKnight = "n",
  BlackBishop = "b",
  BlackQueen = "q",
  BlackKing = "k",
  BlackPawn = "p",
}

export const piecesImage: Record<FENChar, string> = {
  [FENChar.WhiteRook]: "white-rook.svg",
  [FENChar.WhiteKnight]: "white-knight.svg",
  [FENChar.WhiteBishop]: "white-bishop.svg",
  [FENChar.WhiteQueen]: "white-queen.svg",
  [FENChar.WhiteKing]: "white-king.svg",
  [FENChar.WhitePawn]: "white-pawn.svg",
  [FENChar.BlackRook]: "black-rook.svg",
  [FENChar.BlackKnight]: "black-knight.svg",
  [FENChar.BlackBishop]: "black-bishop.svg",
  [FENChar.BlackQueen]: "black-queen.svg",
  [FENChar.BlackKing]: "black-king.svg",
  [FENChar.BlackPawn]: "black-pawn.svg",
};

export enum Color {
  Black,
  White,
}

export type SelectedSquare = { piece: Piece; square: Square } | null;
