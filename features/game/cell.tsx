import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import { CellState, Piece } from "./types";
import { PromotionPiece } from "./promotion-piece";
import { useGameStore } from "./hooks";
import { detectCheckmate, detectStalemate } from "./utils";

interface BoardCellProps {
  cellState: CellState;
  row: number;
  col: number;
  validMoves: [number, number][];
}

export const BoardCell: React.FC<BoardCellProps> = ({
  row,
  col,
  cellState,
  validMoves,
}) => {
  const endGame = useGameStore((state) => state.endGame);
  const changeTurn = useGameStore((state) => state.changeTurn);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const promotePawn = useGameStore((state) => state.promotePawn);
  const { active, setNodeRef } = useDroppable({
    id: `${row}-${col}`,
  });

  const onPromotion = (piece?: Piece) => {
    promotePawn([row, col], {
      piece: piece ?? Piece.Queen,
      color: cellState!.color,
    });
    const board = useGameStore.getState().board;
    const nextTurn = useGameStore.getState().nextTurn();
    const kingPosition = useGameStore.getState().opposingKingPosition();

    if (detectCheckmate(board, nextTurn, kingPosition)) endGame(currentTurn);
    else if (detectStalemate(board, nextTurn, kingPosition)) endGame(null);
    else changeTurn();
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-16 flex relative items-center justify-center h-16",
        row % 2 !== col % 2 ? "bg-[#b5885f]" : "bg-[#ececd0]"
      )}
    >
      {active && validMoves.some(([x, y]) => row === x && col === y) && (
        <div className="w-full h-full z-10 absolute bg-green-700/50" />
      )}
      {cellState && (
        <>
          <PromotionPiece
            row={row}
            col={col}
            boardPiece={cellState}
            onPromotion={onPromotion}
          />
        </>
      )}
    </div>
  );
};
