"use client";
import { DndContext } from "@dnd-kit/core";
import { Board } from "./board";
import { useGameStore, usePiecesDnd } from "./hooks";
import React, { useEffect } from "react";

export const Game = () => {
  const { validMoves, ...dragEvents } = usePiecesDnd();
  const currentTurn = useGameStore((state) => state.currentTurn);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const winner = useGameStore((state) => state.winner);
  const reset = useGameStore((state) => state.reset);

  useEffect(() => {
    const restart = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keypress", restart);
    return () => window.removeEventListener("keypress", restart);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-center text-2xl font-semibold">
        {!isGameOver
          ? `${currentTurn} turn to move`
          : `${winner} wins by checkmating`}
      </h3>
      {isGameOver && (
        <p className="text-center text-gray-600">Press R to play again</p>
      )}

      <DndContext {...dragEvents}>
        <Board validMoves={validMoves} />
      </DndContext>
    </div>
  );
};
