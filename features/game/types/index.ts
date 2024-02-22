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

export type CellState = BoardPiece | null;

export interface PieceMetadata {
  row: number;
  col: number;
  boardPiece: BoardPiece;
}
