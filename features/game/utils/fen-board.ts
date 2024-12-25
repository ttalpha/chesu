import { isLower, isNumeric } from "@/features/common/utils";
import { BOARD_SIZE } from "../constants";
import { CellState, Color, Piece } from "../types";

export const convertFenToBoard = (fen: string) => {
  const fenRows = fen.split("/");
  const board: CellState[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  let i = BOARD_SIZE - 1;
  let j = 0;
  for (const row of fenRows) {
    for (const char of row) {
      if (!isNumeric(char)) {
        const color = isLower(char) ? Color.White : Color.Black;
        board[i][j++] = {
          color,
          piece: char.toUpperCase() as Piece,
        };
      }
    }
    i--;
    j = 0;
  }
  return board;
};

export const convertBoardToFen = (board: CellState[][]) => {
  let fen = "";
  for (let i = BOARD_SIZE - 1; i >= 0; i--) {
    let emptyCells = 0;
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = board[i][j];
      if (cell === null) {
        emptyCells++;
      } else {
        if (emptyCells > 0) {
          fen += emptyCells;
          emptyCells = 0;
        }
        const char =
          cell.color === Color.White ? cell.piece : cell.piece.toLowerCase();
        fen += char;
      }
    }
    if (emptyCells > 0) {
      fen += emptyCells;
    }
    if (i > 0) {
      fen += "/";
    }
  }
  return fen;
};
