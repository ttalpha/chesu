import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export class Bishop extends Piece {
  constructor(color: Color) {
    const fenChar =
      color === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
    const directions = [
      new Square(1, 1),
      new Square(-1, 1),
      new Square(1, -1),
      new Square(-1, -1),
    ];
    super(fenChar, color, directions);
  }
}
