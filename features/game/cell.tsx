import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { DraggablePiece } from "./draggable-piece";
import { CellState } from "./types";

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
  const { active, setNodeRef } = useDroppable({
    id: `${row}-${col}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-16 flex relative items-center justify-center h-16",
        row % 2 === col % 2 ? "bg-neutral-200" : "bg-neutral-400"
      )}
    >
      {active && validMoves.some(([x, y]) => row === x && col === y) && (
        <div className="w-6 h-6 z-20 rounded-full absolute bg-green-800/50" />
      )}
      {cellState && (
        <DraggablePiece row={row} col={col} boardPiece={cellState} />
      )}
    </div>
  );
};
