import { BOARD_SIZE } from "../constants";
import { CellState, Color } from "../types";

export const isOutOfBound = ([x, y]: [number, number]) => {
  return x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE;
};
export const isSameColor = (
  board: CellState[][],
  color: Color,
  [x, y]: [number, number]
) => {
  return !isOutOfBound([x, y]) && board[x][y]?.color === color;
};
