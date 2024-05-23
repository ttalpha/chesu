import { Color, DrawReason } from "./types.mjs";

export class Display {
  private messageElement = document.getElementById("message");

  displayWinMessage(winnerColor: Color) {
    const winner = winnerColor === Color.White ? "White" : "Black";
    this.messageElement.innerText = `${winner} won by checkmate`;
  }

  displayDrawMessage(drawReason: DrawReason) {
    this.messageElement.innerText = `Draw by ${drawReason}`;
  }

  clearMessage() {
    this.messageElement.innerText = "";
  }
}
