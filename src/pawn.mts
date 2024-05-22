import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export class Pawn extends Piece {
  constructor(color: Color) {
    const fenChar =
      color === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn;

    const verticalDirection = color === Color.White ? -1 : 1;

    const directions = [
      new Square(verticalDirection * 2, 0),
      new Square(verticalDirection, 1),
      new Square(verticalDirection, -1),
      new Square(verticalDirection, 0),
    ];
    super(fenChar, color, directions);
  }
}
