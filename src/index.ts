import { Board } from "./board.mjs";
import { Piece } from "./piece.mjs";
import { Rook } from "./rook.mjs";
import { Knight } from "./knight.mjs";
import { Bishop } from "./bishop.mjs";
import { Queen } from "./queen.mjs";
import { King } from "./king.mjs";
import { Pawn } from "./pawn.mjs";
import { Color } from "./types.mjs";
import { Game } from "./game.mjs";
import { Square } from "./square.mjs";
import { Detector } from "./detector.mjs";
import { MovesGenerator } from "./moves-generator.mjs";
import { Display } from "./display.mjs";

const startingBoard: (Piece | null)[][] = [
  [
    new Rook(Color.Black),
    new Knight(Color.Black),
    new Bishop(Color.Black),
    new Queen(Color.Black),
    new King(Color.Black),
    new Bishop(Color.Black),
    new Knight(Color.Black),
    new Rook(Color.Black),
  ],
  [
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
    new Pawn(Color.Black),
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
    new Pawn(Color.White),
  ],
  [
    new Rook(Color.White),
    new Knight(Color.White),
    new Bishop(Color.White),
    new Queen(Color.White),
    new King(Color.White),
    new Bishop(Color.White),
    new Knight(Color.White),
    new Rook(Color.White),
  ],
];

const loadGame = () => {
  const board = new Board([...startingBoard.map((row) => [...row])]);

  const movesGenerator = new MovesGenerator(board);
  const detector = new Detector(board, movesGenerator);
  const display = new Display();
  const game = new Game(board, detector, display, movesGenerator);
  return game;
};
let game = loadGame();

window.addEventListener("load", () => {
  onSquaresSelect();
});

window.addEventListener("keypress", (e) => {
  if (game.isGameOver && e.key.toLowerCase() === "r") {
    game = loadGame();
    onSquaresSelect();
  }
});

const onSquaresSelect = () => {
  document
    .querySelectorAll("[data-square]")
    .forEach((square: HTMLDivElement) => {
      square.addEventListener("click", (event) => {
        const squareElement = event.currentTarget as HTMLDivElement;
        const [x, y] = squareElement.getAttribute("data-square").split(",");

        const currentSquare = new Square(+x, +y);
        game.showMoves(currentSquare);
        game.movePiece(currentSquare);
      });
    });
};
