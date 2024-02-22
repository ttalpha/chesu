import { useDraggable } from "@dnd-kit/core";
import { ChessPiece } from "./piece";
import { BoardPiece } from "./types";

interface DraggablePieceProps {
  row: number;
  col: number;
  boardPiece: BoardPiece;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  row,
  col,
  boardPiece,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${row}-${col}`,
    data: { row, col, boardPiece },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="relative z-10"
      {...listeners}
      {...attributes}
      style={style}
      ref={setNodeRef}
    >
      <ChessPiece boardPiece={boardPiece} />
    </div>
  );
};
