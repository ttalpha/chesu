export class Square {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equal(square: Square) {
    return this.x === square.x && this.y === square.y;
  }
}
