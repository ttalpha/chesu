export enum Piece {
  Rook = "R",
  Knight = "N",
  Bishop = "B",
  Queen = "Q",
  King = "K",
  Pawn = "P",
}

export enum Color {
  White = "White",
  Black = "Black",
}

export interface BoardPiece {
  piece: Piece;
  color: Color;
}

export enum DrawReason {
  Stalemate = "Stalemate",
  InsufficientMaterial = "Insufficient Material",
  ThreefoldRepetition = "Threefold Repetition",
  FiftyMoveRule = "Fifty-move Rule",
}

export type CellState = BoardPiece | null;

export interface PieceMetadata {
  row: number;
  col: number;
  boardPiece: BoardPiece;
}

export interface Move {
  piece: Piece;
  from: [number, number];
  to: [number, number];
  check: boolean;
  promotionPiece?: Piece;
  checkmate: boolean;
  isEnPassant: boolean;
  kingSideCastle: boolean;
  queenSideCastle: boolean;
  capture: boolean;
}
