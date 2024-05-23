import { Audio } from "./audio.mjs";
import { Board } from "./board.mjs";
import { Detector } from "./detector.mjs";
import { Display } from "./display.mjs";
import { King } from "./king.mjs";
import { MovesGenerator } from "./moves-generator.mjs";
import { Rook } from "./rook.mjs";
import { Square } from "./square.mjs";
import { AudioType, Color, DrawReason, SelectedSquare } from "./types.mjs";

export class Game {
  private chessBoard: Board;
  private currentTurn: Color;
  private detector: Detector;
  private display: Display;
  private movesGenerator: MovesGenerator;
  private selected: SelectedSquare = null;
  private selectableSquares: Square[] = [];
  private _isGameOver: boolean;

  constructor(
    chessBoard: Board,
    detector: Detector,
    display: Display,
    movesGenerator: MovesGenerator,
    currentTurn: Color = Color.White
  ) {
    this._isGameOver = false;
    this.display = display;
    this.chessBoard = chessBoard;
    this.detector = detector;
    this.movesGenerator = movesGenerator;
    this.currentTurn = currentTurn;
    this.display.clearMessage();
  }

  get isGameOver() {
    return this._isGameOver;
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
    this.selectableSquares = this.movesGenerator.generate(
      squarePiece,
      currentSquare,
      this.detector.detectKingInCheck.bind(this.detector)
    );
    if (this.selectableSquares.length === 0) return;
    this.selected = { piece: squarePiece, square: currentSquare };
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
    this.updateBoardUI(this.selected.square, newSquare);
    const isCapture = !!this.chessBoard.board[newX][newY];
    this.clearPreviouslySelectedSquares();
    const isCastling =
      this.chessBoard.board[x][y] instanceof King && Math.abs(newY - y) === 2;
    if (
      this.chessBoard.board[x][y] instanceof Rook ||
      this.chessBoard.board[x][y] instanceof King
    ) {
      (this.chessBoard.board[x][y] as Rook).hasMoved = true;
    }
    [this.chessBoard.board[x][y], this.chessBoard.board[newX][newY]] = [
      null,
      this.chessBoard.board[x][y],
    ];

    if (isCastling) {
      const rookRankIndex = newY < y ? 0 : Board.size - 1;
      const rookRankIndexAfterCastling = newY + (newY < y ? 1 : -1);
      (this.chessBoard.board[x][newY] as King).hasMoved = true;
      const rookSquare = this.chessBoard.board[x][rookRankIndex];
      this.chessBoard.board[x][rookRankIndexAfterCastling] = rookSquare;
      this.chessBoard.board[x][rookRankIndex] = null;
      this.updateBoardUI(
        new Square(x, rookRankIndex),
        new Square(x, rookRankIndexAfterCastling)
      );
    }

    const previousTurn = this.currentTurn;
    this.currentTurn =
      this.currentTurn === Color.White ? Color.Black : Color.White;
    const kingPosition = this.chessBoard.findKingPosition(this.currentTurn);
    const isCheck = this.detector.detectKingInCheck(
      this.currentTurn,
      kingPosition
    );
    const isCheckmated = this.detector.detectCheckmate(
      this.currentTurn,
      kingPosition
    );
    const isStalemate = this.detector.detectStatemate(
      this.currentTurn,
      kingPosition
    );
    const isGameOver = isCheckmated || isStalemate;
    if (isGameOver) this._isGameOver = true;

    if (isCheckmated) this.display.displayWinMessage(previousTurn);
    if (isStalemate) this.display.displayDrawMessage(DrawReason.Stalemate);

    this.playAudioAfterMove(isGameOver, isCheck, isCastling, isCapture);
  }

  private updateBoardUI({ x, y }: Square, { x: newX, y: newY }: Square) {
    const currentSquarePiece = document.querySelector(
      `[data-square="${x},${y}"]`
    );
    const newSquarePiece = document.querySelector(
      `[data-square="${newX},${newY}"]`
    );
    newSquarePiece.innerHTML = currentSquarePiece.innerHTML;

    currentSquarePiece.innerHTML = "";
  }

  private playAudioAfterMove(
    isGameOver: boolean,
    isChecked: boolean,
    isCastling: boolean,
    isCaptured: boolean
  ) {
    if (isGameOver) Audio.play(AudioType.GameOver);
    else if (isChecked) {
      Audio.play(AudioType.Check);
    } else if (isCastling) {
      Audio.play(AudioType.Castle);
    } else {
      if (isCaptured) Audio.play(AudioType.Capture);
      else Audio.play(AudioType.Move);
    }
  }

  private clearPreviouslySelectedSquares() {
    document
      .querySelectorAll(`[data-selectable]`)
      .forEach((element) => element.remove());

    this.selected = null;
    this.selectableSquares = [];
  }
}
