import { create } from "zustand";
import {
  BoardPiece,
  CellState,
  Color,
  DrawReason,
  Move,
  Piece,
} from "../types";
import { convertFenToBoard, detectCheckmate, detectChecks } from "../utils";
import {
  BOARD_SIZE,
  FIRST_BLACK_KING_POSITION,
  FIRST_WHITE_KING_POSITION,
  STARTING_FEN,
} from "../constants";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { isEnPassantMove } from "../utils/check-en-passant";
import { isCastleMove } from "../utils/check-castling";
import { enableMapSet } from "immer";

enableMapSet();

interface Action {
  changeTurn: () => void;
  nextTurn: () => Color;
  opposingKingPosition: () => [number, number];
  movePiece: (
    oldPosition: [number, number],
    newPosition: [number, number]
  ) => void;
  castle: (
    oldPosition: [number, number],
    newPosition: [number, number]
  ) => void;
  promotePawn: (newPosition: [number, number], piece: BoardPiece) => void;
  endGame: (winner: Color | null, drawReason: DrawReason | null) => void;
  reset: () => void;
  setKingPosition: (color: Color, newPosition: [number, number]) => void;
  addFenToHistory: (fen: string) => void;
}

interface State {
  fenHistory: Map<string, number>;
  drawReason: DrawReason | null;
  board: CellState[][];
  currentTurn: Color;
  isGameOver: boolean;
  whiteKingPosition: [number, number];
  blackKingPosition: [number, number];
  winner: Color | null;
  moves: Move[];
}

const initialStates: State = {
  fenHistory: new Map(),
  drawReason: null,
  board: convertFenToBoard(STARTING_FEN),
  currentTurn: Color.White,
  isGameOver: false,
  winner: null,
  whiteKingPosition: FIRST_WHITE_KING_POSITION,
  blackKingPosition: FIRST_BLACK_KING_POSITION,
  moves: [],
};

export const useGameStore = create<State & Action>()(
  immer(
    subscribeWithSelector((set, get) => ({
      ...initialStates,
      changeTurn: () =>
        set((state) => {
          if (state.currentTurn === Color.White)
            state.currentTurn = Color.Black;
          else state.currentTurn = Color.White;
        }),
      castle: (
        [oldX, oldY]: [number, number],
        [newX, newY]: [number, number]
      ) =>
        set((state) => {
          const { kingSideCastle, queenSideCastle } = isCastleMove(
            state.board,
            [oldX, oldY],
            [newX, newY]
          );
          const rookToCastleRowIndex =
            +(state.currentTurn === Color.White) * (BOARD_SIZE - 1);
          const rookToCastleColIndex = kingSideCastle ? BOARD_SIZE - 1 : 0;
          const rookColAfterCastlingPosition = kingSideCastle
            ? oldY + 1
            : oldY - 1;
          if (kingSideCastle || queenSideCastle) {
            state.board[rookToCastleRowIndex][rookToCastleColIndex] = null;
            state.board[oldX][rookColAfterCastlingPosition] = {
              color: state.currentTurn,
              piece: Piece.Rook,
            };
          }
        }),
      promotePawn: ([newX, newY]: [number, number], piece: BoardPiece) =>
        set((state) => {
          state.board[newX][newY] = piece;
          state.moves[state.moves.length - 1] = {
            ...state.moves[state.moves.length - 1],
            promotionPiece: piece.piece,
            check: detectChecks(
              state.board,
              get().nextTurn(),
              get().opposingKingPosition()
            ),
            checkmate: detectCheckmate(
              state.board,
              get().nextTurn(),
              get().opposingKingPosition()
            ),
          };
        }),
      movePiece: ([oldX, oldY], [newX, newY]) =>
        set((state) => {
          const oldPosition = state.board[oldX][oldY];
          let hasPiece = state.board[newX][newY] !== null;

          const { kingSideCastle, queenSideCastle } = isCastleMove(
            state.board,
            [oldX, oldY],
            [newX, newY]
          );
          const isEnPassant = isEnPassantMove(
            state.board,
            [oldX, oldY],
            [newX, newY]
          );
          state.board[newX][newY] = oldPosition;
          state.board[oldX][oldY] = null;
          if (isEnPassant) {
            state.board[oldX][newY] = null;
            hasPiece = true;
          }
          const newMove: Move = {
            from: [oldX, oldY],
            to: [newX, newY],
            piece: oldPosition!.piece,
            check: detectChecks(
              state.board,
              get().nextTurn(),
              get().opposingKingPosition()
            ),
            checkmate: detectCheckmate(
              state.board,
              get().nextTurn(),
              get().opposingKingPosition()
            ),
            capture: hasPiece,
            isEnPassant,
            kingSideCastle,
            queenSideCastle,
          };

          state.moves.push(newMove);
        }),
      addFenToHistory: (fen: string) =>
        set((state) => {
          const count = state.fenHistory.get(fen) || 0;
          state.fenHistory.set(fen, count + 1);
        }),
      nextTurn: () =>
        get().currentTurn === Color.White ? Color.Black : Color.White,
      opposingKingPosition: () =>
        get().currentTurn === Color.White
          ? get().blackKingPosition
          : get().whiteKingPosition,
      setKingPosition: (color, newPosition) =>
        set((state) => {
          if (color === Color.White) state.whiteKingPosition = newPosition;
          else state.blackKingPosition = newPosition;
        }),
      endGame: (winner, drawReason) =>
        set((state) => {
          state.winner = winner;
          state.isGameOver = true;
          state.drawReason = drawReason;
        }),
      reset: () =>
        set((state) => {
          state.isGameOver = false;
          state.winner = null;
          state.fenHistory = new Map();
          state.board = initialStates.board;
          state.currentTurn = Color.White;
          state.whiteKingPosition = FIRST_WHITE_KING_POSITION;
          state.blackKingPosition = FIRST_BLACK_KING_POSITION;
          state.drawReason = null;
          state.moves = [];
        }),
    }))
  )
);
