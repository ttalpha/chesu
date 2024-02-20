"use client";
import { DndContext, useDndMonitor } from "@dnd-kit/core";
import { BoardCell } from "./cell";
import { useGameStore } from "./hooks";
import { useState } from "react";
import { PieceMetadata } from "./types";
import { generateMoves } from "./utils";

export const Board = () => {
  return (
    <DndContext>
      <BoardContext />
    </DndContext>
  );
};

function BoardContext() {
  const board = useGameStore.getState().board;
  const currentTurn = useGameStore.getState().currentTurn;
  const movePiece = useGameStore.getState().movePiece;
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  useDndMonitor({
    onDragStart(event) {
      const { row, col, boardPiece } = event.active.data
        .current as PieceMetadata;
      if (boardPiece.color !== currentTurn) return;
      setValidMoves(() =>
        generateMoves(board, currentTurn, boardPiece.piece, [row, col])
      );
      console.log({ row, col, boardPiece });
    },
    onDragMove(event) {},
    onDragOver(event) {},
    onDragEnd(event) {
      if (!event.over?.id) return;
      const { row, col, boardPiece } = event.active.data
        .current as PieceMetadata;
      if (boardPiece.color !== currentTurn) return;
      const [newRow, newCol] = event.over.id.toString().split("-");
      setValidMoves([]);
      movePiece([row, col], [+newRow, +newCol]);
    },
    onDragCancel(event) {
      setValidMoves([]);
    },
  });

  return (
    <div className="max-w-fit h-fit mx-auto grid grid-cols-8">
      {board.map((row, i) =>
        row.map((cellState, j) => (
          <BoardCell
            validMoves={validMoves}
            key={`${i}-${j}`}
            cellState={cellState}
            row={i}
            col={j}
          />
        ))
      )}
    </div>
  );
}
