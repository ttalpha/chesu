import { useGameStore } from "./use-game-store";
import { use, useState } from "react";
import { Color, Piece, PieceMetadata } from "../types";
import { detectCheckmate, detectStalemate, generateMoves } from "../utils";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { produce } from "immer";
import { BOARD_SIZE } from "../constants";

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

      const kingPosition =
        currentTurn === Color.White ? blackKingPosition : whiteKingPosition;
      const loser = currentTurn === Color.White ? Color.Black : Color.White;
      const latestBoard = produce(board, (draft) => {
        [draft[row][col], draft[+newRow][+newCol]] = [null, draft[row][col]];
      });
      const isPromotion =
        boardPiece.piece === Piece.Pawn &&
        (+newRow === 0 || +newRow === BOARD_SIZE - 1);
      if (isPromotion) return;
      if (useGameStore.getState().moves.at(-1)?.checkmate) endGame(currentTurn);
      else if (detectStalemate(latestBoard, loser, kingPosition)) endGame(null);
      else changeTurn();
    }
  }
  function onDragCancel() {
    setValidMoves([]);
  }

  return { onDragStart, onDragEnd, onDragCancel, validMoves };
};
