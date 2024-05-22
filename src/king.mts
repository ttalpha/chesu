import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export class King extends Piece {
  constructor(color: Color) {
    const fenChar =
      color === Color.White ? FENChar.WhiteKing : FENChar.BlackKing;

    const directions = [
      new Square(1, 1),
      new Square(-1, 1),
      new Square(1, -1),
      new Square(-1, -1),
      new Square(1, 0),
      new Square(0, 1),
      new Square(0, -1),
      new Square(-1, 0),
    ];
    super(fenChar, color, directions);
  }
}
