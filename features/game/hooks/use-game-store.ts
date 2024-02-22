import { create } from "zustand";
import { CellState, Color } from "../types";
import { convertFenToBoard } from "../utils";
import {
  FIRST_BLACK_KING_POSITION,
  FIRST_WHITE_KING_POSITION,
  STARTING_FEN,
} from "../constants";
import { immer } from "zustand/middleware/immer";

interface Action {
  changeTurn: () => void;
  movePiece: (
    oldPosition: [number, number],
    newPosition: [number, number]
  ) => void;
  endGame: (winner: Color) => void;
  reset: () => void;
  setKingPosition: (color: Color, newPosition: [number, number]) => void;
}

interface State {
  board: CellState[][];
  currentTurn: Color;
  isGameOver: boolean;
  whiteKingPosition: [number, number];
  blackKingPosition: [number, number];
  winner: Color | null;
}

const initialStates: State = {
  board: convertFenToBoard(STARTING_FEN),
  currentTurn: Color.White,
  isGameOver: false,
  winner: null,
  whiteKingPosition: FIRST_WHITE_KING_POSITION,
  blackKingPosition: FIRST_BLACK_KING_POSITION,
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
    setKingPosition: (color, newPosition) =>
      set((state) => {
        if (color === Color.White) state.whiteKingPosition = newPosition;
        else state.blackKingPosition = newPosition;
      }),
    endGame: (winner) =>
      set((state) => {
        state.winner = winner;
        state.isGameOver = true;
      }),
    reset: () =>
      set((state) => {
        state.isGameOver = false;
        state.winner = null;
        state.board = initialStates.board;
        state.currentTurn = Color.White;
      }),
  }))
);
