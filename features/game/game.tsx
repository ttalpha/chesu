"use client";
import { DndContext } from "@dnd-kit/core";
import { Board } from "./board";
import { useGameStore, usePiecesDnd } from "./hooks";
import React, { useEffect } from "react";
import { Moves } from "./moves";

export const Game = () => {
  const { validMoves, ...dragEvents } = usePiecesDnd();
  const currentTurn = useGameStore((state) => state.currentTurn);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const winner = useGameStore((state) => state.winner);
  const reset = useGameStore((state) => state.reset);
  const drawReason = useGameStore((state) => state.drawReason);

  useEffect(() => {
    const restart = (e: KeyboardEvent) => {
      if (!isGameOver) return;
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keypress", restart);
    return () => window.removeEventListener("keypress", restart);
  }, [isGameOver]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end gap-8">
        <div>
          <h3 className="text-center text-xl font-semibold">
            {!isGameOver
              ? `${currentTurn} turn to move`
              : winner
              ? `${winner} wins by checkmate`
              : `Draw by ${drawReason}`}
          </h3>
          {isGameOver && (
            <p className="text-center text-gray-600">Press R to play again</p>
          )}
          <div className="mt-6">
            <DndContext {...dragEvents}>
              <Board validMoves={validMoves} />
            </DndContext>
          </div>
        </div>
        <Moves />
      </div>
    </div>
  );
};
