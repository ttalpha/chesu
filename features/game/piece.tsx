import Image from "next/image";
import { BoardPiece, Color } from "./types";
import { getPieceName } from "./utils";
import { useGameStore } from "./hooks";
import { cn } from "@/lib/utils";

interface ChessPieceProps {
  boardPiece: BoardPiece;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ boardPiece }) => {
  const currentTurn = useGameStore((state) => state.currentTurn);
  const color = boardPiece.color === Color.White ? "white" : "black";
  const pieceName = getPieceName(boardPiece.piece);
  return (
    <Image
      className={cn(currentTurn === boardPiece.color && "cursor-grab")}
      alt={`${color} ${pieceName}`}
      src={`/assets/pieces/${color}-${pieceName}.svg`}
      width={60}
      height={60}
    />
  );
};
