import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export class Knight extends Piece {
  constructor(color: Color) {
    const fenChar =
      color === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;

    const directions = [
      new Square(1, 2),
      new Square(1, -2),
      new Square(-1, 2),
      new Square(-1, -2),
      new Square(2, 1),
      new Square(2, -1),
      new Square(-2, 1),
      new Square(-2, -1),
    ];

    super(fenChar, color, directions);
  }
}
