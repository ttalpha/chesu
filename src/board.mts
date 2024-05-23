import { King } from "./king.mjs";
import { Piece } from "./piece.mjs";
import { Square } from "./square.mjs";
import { Color, piecesImage } from "./types.mjs";

export class Board {
  static readonly size = 8;
  private _board: (Piece | null)[][];

  constructor(board: (Piece | null)[][]) {
    this._board = board;
    this.draw();
  }

  static isOutOfBound(square: Square): boolean {
    return (
      square.x < 0 ||
      square.y < 0 ||
      square.x >= Board.size ||
      square.y >= Board.size
    );
  }

  checkIsEmpty({ x, y }: Square) {
    return !this.board[x][y];
  }

  checkIsAllyPiece({ x, y }: Square, color: Color) {
    return this.board[x][y] && this.board[x][y].color === color;
  }
  checkIsEnemyPiece({ x, y }: Square, color: Color) {
    return this.board[x][y] && this.board[x][y].color !== color;
  }

  private draw() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = null;
    this._board.forEach((row, i) => {
      row.forEach((square, j) => {
        const squareElement = document.createElement("div");
        squareElement.classList.add(
          "w-16",
          "h-16",
          "flex",
          "relative",
          "justify-center",
          "items-center",
          (i & 1) === (j & 1) ? "bg-white" : "bg-green-700"
        );
        squareElement.setAttribute("data-square", i + "," + j);
        if (square) {
          const pieceElement = document.createElement("img");
          pieceElement.src = `assets/pieces/${piecesImage[square.fen]}`;
          pieceElement.classList.add("cursor-pointer");
          pieceElement.width = 60;
          pieceElement.height = 60;
          squareElement.innerHTML = pieceElement.outerHTML;
        }
        boardElement.innerHTML += squareElement.outerHTML;
      });
    });
  }

  findKingPosition(color: Color): Square {
    for (let i = 0; i < Board.size; i++)
      for (let j = 0; j < Board.size; j++) {
        if (
          this.board[i][j] instanceof King &&
          this.board[i][j].color === color
        )
          return new Square(i, j);
      }
    return null;
  }

  get board() {
    return this._board;
  }

  set board(newBoard) {
    this._board = newBoard;
  }
}
