import { BoardCell } from "./cell";
import { useGameStore } from "./hooks";

export function Board({ validMoves = [] }: { validMoves: [number, number][] }) {
  const board = useGameStore((state) => state.board);
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
