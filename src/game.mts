import { Bishop } from "./bishop.mjs";
import { Board } from "./board.mjs";
import { King } from "./king.mjs";
import { Knight } from "./knight.mjs";
import { Pawn } from "./pawn.mjs";
import { Piece } from "./piece.mjs";
import { Queen } from "./queen.mjs";
import { Rook } from "./rook.mjs";
import { Square } from "./square.mjs";
import { Color, SelectedSquare } from "./types.mjs";

export class Game {
  private chessBoard: Board;
  private currentTurn: Color;
  private selected: SelectedSquare = null;
  private selectableSquares: Square[] = [];

  constructor(chessBoard: Board, currentTurn: Color = Color.White) {
    this.chessBoard = chessBoard;
    this.currentTurn = currentTurn;
  }

  showMoves(currentSquare: Square) {
    const { x, y } = currentSquare;
    const squarePiece = this.chessBoard.board[x][y];
    if (!squarePiece || squarePiece.color !== this.currentTurn) return;
    if (this.selected) {
      const previousSelectedSquare = this.selected.square;
      this.clearPreviouslySelectedSquares();
      if (previousSelectedSquare.equal(currentSquare)) return;
    }
    this.selected = { piece: squarePiece, square: currentSquare };
    this.generateMoves(squarePiece, currentSquare);
    for (const move of this.selectableSquares) {
      const selectableElement = document.createElement("div");
      selectableElement.className =
        "bg-gray-600/70 absolute rounded-full w-6 h-6";
      const newSquareElement = document.querySelector(
        `[data-square="${move.x},${move.y}"]`
      ) as HTMLDivElement;
      selectableElement.setAttribute("data-selectable", "true");
      newSquareElement.appendChild(selectableElement);
    }
  }

  movePiece(newSquare: Square) {
    if (!this.selected) return;
    const { x, y } = this.selected.square;
    const { x: newX, y: newY } = newSquare;
    if (this.selected.square.equal(newSquare)) return;
    if (!this.selectableSquares.some((square) => square.equal(newSquare)))
      return;
    const currentSquarePiece = document.querySelector(
      `[data-square="${x},${y}"]`
    );
    const newSquarePiece = document.querySelector(
      `[data-square="${newX},${newY}"]`
    );
    newSquarePiece.innerHTML = currentSquarePiece.innerHTML;

    currentSquarePiece.innerHTML = "";
    this.clearPreviouslySelectedSquares();
    [this.chessBoard.board[x][y], this.chessBoard.board[newX][newY]] = [
      null,
      this.chessBoard.board[x][y],
    ];
    this.currentTurn =
      this.currentTurn === Color.White ? Color.Black : Color.White;
  }

  private clearPreviouslySelectedSquares() {
    document
      .querySelectorAll(`[data-selectable]`)
      .forEach((element) => element.remove());

    this.selected = null;
    this.selectableSquares = [];
  }

  private generateMoves(piece: Piece, currentSquare: Square) {
    for (const direction of piece.directions) {
      this.generatePawnMoves(piece, currentSquare, direction);
      this.generateKingAndKnightMoves(piece, currentSquare, direction);
      this.generateOtherPiecesMoves(piece, currentSquare, direction);
    }
  }

  private generatePawnMoves(
    piece: Piece,
    { x, y }: Square,
    { x: dx, y: dy }: Square
  ) {
    if (!(piece instanceof Pawn)) return;
    const newSquare = new Square(x + dx, y + dy);
    if (Board.isOutOfBound(newSquare)) return;

    if (dy === 0 && !this.chessBoard.checkIsEmpty(newSquare)) return;
    if (
      Math.abs(dy) === 1 &&
      !this.chessBoard.checkIsEnemyPiece(newSquare, piece.color)
    )
      return;
    const firstPawnPosition = piece.color === Color.White ? 6 : 1;
    if (
      Math.abs(dx) === 2 &&
      (x !== firstPawnPosition ||
        !this.chessBoard.checkIsEmpty(new Square(x + Math.sign(dx), y)))
    )
      return;
    this.selectableSquares.push(newSquare);
  }

  private generateKingAndKnightMoves(
    piece: Piece,
    { x, y }: Square,
    { x: dx, y: dy }: Square
  ) {
    if (!(piece instanceof King || piece instanceof Knight)) return;
    const newSquare = new Square(x + dx, y + dy);
    if (
      Board.isOutOfBound(newSquare) ||
      this.chessBoard.checkIsAllyPiece(newSquare, piece.color)
    )
      return;
    this.selectableSquares.push(newSquare);
  }

  private generateOtherPiecesMoves(
    piece: Piece,
    { x, y }: Square,
    { x: dx, y: dy }: Square
  ) {
    if (
      !(
        piece instanceof Queen ||
        piece instanceof Bishop ||
        piece instanceof Rook
      )
    )
      return;
    for (let i = 1; i < Board.size; i++) {
      const newSquare = new Square(x + dx * i, y + dy * i);

      if (
        Board.isOutOfBound(newSquare) ||
        this.chessBoard.checkIsAllyPiece(newSquare, piece.color)
      )
        break;
      this.selectableSquares.push(newSquare);

      if (this.chessBoard.checkIsEnemyPiece(newSquare, piece.color)) break;
    }
  }
}
