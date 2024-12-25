import React from "react";
import { useGameStore } from "./hooks";
import { Color } from "./types";
import { convertCellToPGN } from "./utils";

export const Moves = () => {
  const moves = useGameStore((state) => state.moves);
  const winner = useGameStore((state) => state.winner);
  const isGameOver = useGameStore((state) => state.isGameOver);
  return (
    <div className="h-[512px] w overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-5 gap-x-3 gap-y-4 text-sm py-2">
        {Array(Math.ceil(moves.length / 2))
          .fill(null)
          .map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-muted-foreground">{i + 1}.</span>{" "}
              <span className="text-primary font-medium col-span-2">
                {moves[i * 2] && convertCellToPGN(moves[i * 2])}
              </span>
              <span className="text-primary font-medium col-span-2">
                {moves[i * 2 + 1] && convertCellToPGN(moves[i * 2 + 1])}
              </span>
            </React.Fragment>
          ))}

        <span className="text-sm justify-start font-medium py-2">
          {isGameOver && winner === null && "1/2-1/2"}
          {winner === Color.White && "1-0"}
          {winner === Color.Black && "0-1"}
        </span>
      </div>
    </div>
  );
};
