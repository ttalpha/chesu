import { create } from "zustand";
import { CellState, Color } from "../types";
import { convertFenToBoard } from "../utils";
import { STARTING_FEN } from "../constants";
import { immer } from "zustand/middleware/immer";

interface Action {
  changeTurn: () => void;
  movePiece: (
    oldPosition: [number, number],
    newPosition: [number, number]
  ) => void;
}

interface State {
  board: CellState[][];
  currentTurn: Color;
}

const initialStates: State = {
  board: convertFenToBoard(STARTING_FEN),
  currentTurn: Color.White,
};

export const useGameStore = create<State & Action>()(
  immer((set) => ({
    ...initialStates,
    changeTurn: () =>
      set((state) => {
        if (state.currentTurn === Color.White) state.currentTurn = Color.Black;
        else state.currentTurn = Color.White;
      }),
    movePiece: ([oldX, oldY], [newX, newY]) =>
      set((state) => {
        const oldPosition = state.board[oldX][oldY];
        state.board[oldX][oldY] = null;
        state.board[newX][newY] = oldPosition;
      }),
  }))
);
