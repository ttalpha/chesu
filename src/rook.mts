import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export class Rook extends Piece {
  private _hasMoved: boolean = false;

  constructor(color: Color) {
    const fenChar =
      color === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    const directions = [
      new Square(1, 0),
      new Square(0, 1),
      new Square(0, -1),
      new Square(-1, 0),
    ];
    super(fenChar, color, directions);
  }

  get hasMoved() {
    return this._hasMoved;
  }

  set hasMoved(_: boolean) {
    this.hasMoved = true;
  }
}
