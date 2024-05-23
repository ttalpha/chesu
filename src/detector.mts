import { Bishop } from "./bishop.mjs";
import { Board } from "./board.mjs";
import { King } from "./king.mjs";
import { Knight } from "./knight.mjs";
import { MovesGenerator } from "./moves-generator.mjs";
import { Pawn } from "./pawn.mjs";
import { Piece } from "./piece.mjs";
import { Queen } from "./queen.mjs";
import { Rook } from "./rook.mjs";
import { Square } from "./square.mjs";
import { Color } from "./types.mjs";

export class Detector {
  private chessBoard: Board;
  private movesGenerator: MovesGenerator;

  constructor(chessBoard: Board, movesGenerator: MovesGenerator) {
    this.chessBoard = chessBoard;
    this.movesGenerator = movesGenerator;
  }

  detectKingInCheck(color: Color, kingPosition: Square): boolean {
    return (
      this.detectFileOrRankCheck(color, kingPosition) ||
      this.detectCheckByKnight(color, kingPosition) ||
      this.detectDiagonalCheck(color, kingPosition) ||
      this.detectPawnCheck(color, kingPosition) ||
      this.detectControlByEnemyKing(color, kingPosition)
    );
  }

  detectCheckmate(color: Color, kingPosition: Square) {
    return (
      this.detectKingInCheck(color, kingPosition) &&
      this.detectNoValidMoves(color)
    );
  }

  detectStatemate(color: Color, kingPosition: Square) {
    return (
      !this.detectKingInCheck(color, kingPosition) &&
      this.detectNoValidMoves(color)
    );
  }

  private detectNoValidMoves(color: Color) {
    let moves: Square[] = [];
    for (let i = 0; i < Board.size; i++) {
      for (let j = 0; j < Board.size; j++) {
        const square = new Square(i, j);
        if (this.chessBoard.checkIsEmpty(square)) continue;
        if (this.chessBoard.checkIsEnemyPiece(square, color)) continue;
        moves = [
          ...moves,
          ...this.movesGenerator.generate(
            this.chessBoard.board[i][j],
            square,
            this.detectKingInCheck.bind(this)
          ),
        ];
      }
    }
    return !moves.length;
  }

  private detectFileOrRankCheck(color: Color, kingPosition: Square): boolean {
    const rook = new Rook(color);
    return this.detectLineCheck(rook, color, kingPosition, Rook);
  }

  private detectPawnCheck(color: Color, kingPosition: Square) {
    const pawn = new Pawn(color);
    const { x, y } = kingPosition;
    for (const { x: dx, y: dy } of pawn.directions) {
      if (dy === 0) continue;
      const newSquare = new Square(x + dx, y + dy);
      const { x: newX, y: newY } = newSquare;
      if (Board.isOutOfBound(newSquare)) continue;
      if (
        this.chessBoard.checkIsEnemyPiece(newSquare, color) &&
        this.chessBoard.board[newX][newY] instanceof Pawn
      )
        return true;
    }
    return false;
  }

  private detectControlByEnemyKing(
    color: Color,
    kingPosition: Square
  ): boolean {
    const king = new King(color);
    const { x, y } = kingPosition;
    for (const { x: dx, y: dy } of king.directions) {
      const newSquare = new Square(x + dx, y + dy);
      if (Board.isOutOfBound(newSquare)) continue;
      if (this.chessBoard.checkIsEmpty(newSquare)) continue;
      if (this.chessBoard.checkIsAllyPiece(newSquare, color)) continue;
      const { x: newX, y: newY } = newSquare;
      if (this.chessBoard.board[newX][newY] instanceof King) return true;
    }
    return false;
  }

  private detectCheckByKnight(color: Color, kingPosition: Square): boolean {
    const { x, y } = kingPosition;
    const knight = new Knight(color); // temporary knight to get the directions
    for (const { x: dx, y: dy } of knight.directions) {
      const possiblyOccupiedByKnightSquare = new Square(x + dx, y + dy);
      const { x: newX, y: newY } = possiblyOccupiedByKnightSquare;
      if (Board.isOutOfBound(possiblyOccupiedByKnightSquare)) continue;
      if (
        this.chessBoard.board[newX][newY] instanceof Knight &&
        this.chessBoard.checkIsEnemyPiece(possiblyOccupiedByKnightSquare, color)
      )
        return true;
    }
    return false;
  }
  private detectDiagonalCheck(color: Color, kingPosition: Square): boolean {
    const bishop = new Bishop(color);
    return this.detectLineCheck(bishop, color, kingPosition, Bishop);
  }

  private detectLineCheck(
    piece: Piece,
    color: Color,
    kingPosition: Square,
    type: typeof Bishop | typeof Rook
  ) {
    const { x, y } = kingPosition;
    for (const { x: dx, y: dy } of piece.directions) {
      for (let i = 1; i < Board.size; i++) {
        const possiblyOccupiedSquare = new Square(x + dx * i, y + dy * i);
        const { x: newX, y: newY } = possiblyOccupiedSquare;
        if (Board.isOutOfBound(possiblyOccupiedSquare)) break;
        if (this.chessBoard.checkIsEmpty(possiblyOccupiedSquare)) continue;
        if (this.chessBoard.checkIsAllyPiece(possiblyOccupiedSquare, color))
          break;
        const piece = this.chessBoard.board[newX][newY];
        if (this.chessBoard.checkIsEnemyPiece(possiblyOccupiedSquare, color)) {
          if (piece instanceof Queen || piece instanceof type) return true;
          else break;
        }
      }
    }
    return false;
  }
}
