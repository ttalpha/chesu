import { Square } from "./square.mjs";
import { Color, FENChar } from "./types.mjs";

export abstract class Piece {
  private readonly _fen: FENChar;
  private readonly _color: Color;
  private readonly _directions: Square[];

  constructor(fen: FENChar, color: Color, directions: Square[]) {
    this._fen = fen;
    this._color = color;
    this._directions = directions;
  }

  get color() {
    return this._color;
  }

  get fen() {
    return this._fen;
  }

  get directions() {
    return this._directions;
  }
}
