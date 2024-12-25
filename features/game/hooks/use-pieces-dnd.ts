import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { BOARD_SIZE } from "../constants";
import { Color, Piece, PieceMetadata } from "../types";
import { checkDrawReason, convertBoardToFen, generateMoves } from "../utils";
import { useGameStore } from "./use-game-store";

export const usePiecesDnd = () => {
  const board = useGameStore((state) => state.board);
  const moves = useGameStore((state) => state.moves);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const movePiece = useGameStore((state) => state.movePiece);
  const castle = useGameStore((state) => state.castle);
  const changeTurn = useGameStore((state) => state.changeTurn);
  const whiteKingPosition = useGameStore((state) => state.whiteKingPosition);
  const blackKingPosition = useGameStore((state) => state.blackKingPosition);
  const setKingPosition = useGameStore((state) => state.setKingPosition);
  const endGame = useGameStore((state) => state.endGame);
  const fenHistory = useGameStore((state) => state.fenHistory);
  const addFenToHistory = useGameStore((state) => state.addFenToHistory);

  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  function onDragStart(event: DragStartEvent) {
    const { row, col, boardPiece } = event.active.data.current as PieceMetadata;
    const kingPosition =
      currentTurn === Color.White ? whiteKingPosition : blackKingPosition;
    if (isGameOver || boardPiece.color !== currentTurn) setValidMoves([]);
    else {
      setValidMoves(
        generateMoves(
          {
            board,
            color: currentTurn,
            kingPosition,
            currentPosition: [row, col],
          },
          boardPiece.piece,
          moves
        )
      );
    }
  }
  function onDragEnd(event: DragEndEvent) {
    if (!event.over?.id) return;
    const { row, col, boardPiece } = event.active.data.current as PieceMetadata;
    if (isGameOver || boardPiece.color !== currentTurn) return;
    const [newRow, newCol] = event.over.id.toString().split("-");
    if (validMoves.some(([x, y]) => +newRow === x && +newCol === y)) {
      if (boardPiece.piece === Piece.King)
        setKingPosition(currentTurn, [+newRow, +newCol]);
      setValidMoves([]);
      castle([row, col], [+newRow, +newCol]);
      movePiece([row, col], [+newRow, +newCol]);

      const kingPosition = useGameStore.getState().opposingKingPosition();
      const nextTurn = useGameStore.getState().nextTurn();
      const isPromotion =
        boardPiece.piece === Piece.Pawn &&
        (+newRow === 0 || +newRow === BOARD_SIZE - 1);

      const latestBoard = useGameStore.getState().board;

      const newDrawReason = checkDrawReason(
        latestBoard,
        nextTurn,
        kingPosition,
        moves,
        fenHistory
      );

      if (isPromotion) return;
      if (useGameStore.getState().moves.at(-1)?.checkmate)
        endGame(currentTurn, null);
      else if (newDrawReason) endGame(null, newDrawReason);
      else {
        changeTurn();
        addFenToHistory(convertBoardToFen(board));
      }
    }
  }
  function onDragCancel() {
    setValidMoves([]);
  }

  return { onDragStart, onDragEnd, onDragCancel, validMoves };
};
