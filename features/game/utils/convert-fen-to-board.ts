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
