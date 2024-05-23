import { Board } from "./board.mjs";
import { King } from "./king.mjs";
import { Knight } from "./knight.mjs";
import { Pawn } from "./pawn.mjs";
import { Piece } from "./piece.mjs";
import { Rook } from "./rook.mjs";
import { Square } from "./square.mjs";
import { Color } from "./types.mjs";

type DetectKingInCheckFunction = (
  color: Color,
  kingPosition: Square
) => boolean;
export class MovesGenerator {
  private chessBoard: Board;

  constructor(chessBoard: Board) {
    this.chessBoard = chessBoard;
  }

  private checkSafeMove(
    color: Color,
    { x, y }: Square,
    { x: newX, y: newY }: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ): boolean {
    const previousSquarePiece = this.chessBoard.board[x][y];
    const newSquarePiece = this.chessBoard.board[newX][newY];

    this.chessBoard.board[newX][newY] = previousSquarePiece;
    this.chessBoard.board[x][y] = null;

    const kingPosition = this.chessBoard.findKingPosition(color);
    const isKingInCheck = detectKingInCheck(color, kingPosition);
    this.chessBoard.board[x][y] = previousSquarePiece;
    this.chessBoard.board[newX][newY] = newSquarePiece;

    return !isKingInCheck;
  }

  private checkCanCastle(
    color: Color,
    kingPosition: Square,
    { x: dx, y: dy }: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ): boolean {
    const { x, y } = kingPosition;
    const newSquare = new Square(x + dx, y + dy);
    const { y: newY } = newSquare;

    const isInCheck = detectKingInCheck(color, kingPosition);
    if (isInCheck) return false;
    if (newY < y) {
      for (let i = 1; i < y; i++) {
        if (!this.chessBoard.checkIsEmpty(new Square(x, i))) return false;
        if (
          !this.checkSafeMove(
            color,
            kingPosition,
            new Square(x, i),
            detectKingInCheck
          )
        )
          return false;
      }
    } else {
      for (let i = y + 1; i < Board.size - 1; i++) {
        if (!this.chessBoard.checkIsEmpty(new Square(x, i))) return false;
        if (
          !this.checkSafeMove(
            color,
            kingPosition,
            new Square(x, i),
            detectKingInCheck
          )
        )
          return false;
      }
    }

    const rookRankIndex = newY < y ? 0 : Board.size - 1;
    const rookSquarePiece = this.chessBoard.board[x][rookRankIndex];
    const rookHasNotMoved =
      this.chessBoard.checkIsAllyPiece(new Square(x, rookRankIndex), color) &&
      rookSquarePiece instanceof Rook &&
      !rookSquarePiece.hasMoved;
    const kingSquare = this.chessBoard.board[x][y];
    const kingHasNotMoved = kingSquare instanceof King && !kingSquare.hasMoved;
    return rookHasNotMoved && kingHasNotMoved;
  }

  generate(
    piece: Piece,
    currentSquare: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ): Square[] {
    let moves: Square[] = [];
    for (const direction of piece.directions) {
      if (piece instanceof Pawn)
        moves = [
          ...moves,
          ...this.generatePawnMoves(
            piece.color,
            currentSquare,
            direction,
            detectKingInCheck
          ),
        ];
      else if (piece instanceof King || piece instanceof Knight) {
        if (
          piece instanceof King &&
          Math.abs(direction.y) === 2 &&
          !this.checkCanCastle(
            piece.color,
            currentSquare,
            direction,
            detectKingInCheck
          )
        )
          continue;
        moves = [
          ...moves,
          ...this.generateKingAndKnightMoves(
            piece.color,
            currentSquare,
            direction,
            detectKingInCheck
          ),
        ];
      } else
        moves = [
          ...moves,
          ...this.generateOtherPiecesMoves(
            piece.color,
            currentSquare,
            direction,
            detectKingInCheck
          ),
        ];
    }
    return moves;
  }

  private generatePawnMoves(
    color: Color,
    currentSquare: Square,
    { x: dx, y: dy }: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ) {
    const moves: Square[] = [];
    const { x, y } = currentSquare;
    const newSquare = new Square(x + dx, y + dy);
    if (Board.isOutOfBound(newSquare)) return moves;
    if (dy === 0 && !this.chessBoard.checkIsEmpty(newSquare)) return moves;
    if (
      Math.abs(dy) === 1 &&
      !this.chessBoard.checkIsEnemyPiece(newSquare, color)
    )
      return moves;
    const firstPawnPosition = color === Color.White ? 6 : 1;
    if (
      Math.abs(dx) === 2 &&
      (x !== firstPawnPosition ||
        !this.chessBoard.checkIsEmpty(new Square(x + Math.sign(dx), y)))
    )
      return moves;
    if (!this.checkSafeMove(color, currentSquare, newSquare, detectKingInCheck))
      return moves;
    moves.push(newSquare);
    return moves;
  }

  private generateKingAndKnightMoves(
    color: Color,
    currentSquare: Square,
    { x: dx, y: dy }: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ) {
    const moves: Square[] = [];
    const { x, y } = currentSquare;
    const newSquare = new Square(x + dx, y + dy);
    if (
      Board.isOutOfBound(newSquare) ||
      this.chessBoard.checkIsAllyPiece(newSquare, color)
    )
      return moves;
    if (!this.checkSafeMove(color, currentSquare, newSquare, detectKingInCheck))
      return moves;
    moves.push(newSquare);
    return moves;
  }

  private generateOtherPiecesMoves(
    color: Color,
    currentSquare: Square,
    { x: dx, y: dy }: Square,
    detectKingInCheck: DetectKingInCheckFunction
  ) {
    const moves = [];
    const { x, y } = currentSquare;
    for (let i = 1; i < Board.size; i++) {
      const newSquare = new Square(x + dx * i, y + dy * i);

      if (
        Board.isOutOfBound(newSquare) ||
        this.chessBoard.checkIsAllyPiece(newSquare, color)
      )
        break;
      if (
        this.checkSafeMove(color, currentSquare, newSquare, detectKingInCheck)
      ) {
        moves.push(newSquare);
      }

      if (this.chessBoard.checkIsEnemyPiece(newSquare, color)) break;
    }
    return moves;
  }
}
