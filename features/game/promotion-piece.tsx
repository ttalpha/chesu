import { BOARD_SIZE } from "./constants";
import { BoardPiece, Piece } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChessPiece } from "./piece";
import { DraggablePiece } from "./draggable-piece";
import { useEffect } from "react";

interface PromotionPieceProps {
  row: number;
  col: number;
  boardPiece: BoardPiece;
  onPromotion: (piece: Piece) => void;
}

export const PromotionPiece = ({
  row,
  col,
  boardPiece: { color, piece },
  onPromotion: setPieceToPromote,
}: PromotionPieceProps) => {
  if (piece === Piece.Pawn && (row === 0 || row === BOARD_SIZE - 1)) {
    return (
      <Popover
        onOpenChange={(open) => {
          if (!open) setPieceToPromote(Piece.Queen);
        }}
        defaultOpen
      >
        <PopoverContent className="w-fit flex gap-x-4">
          <div onClick={() => setPieceToPromote(Piece.Queen)}>
            <ChessPiece boardPiece={{ color, piece: Piece.Queen }} />
          </div>
          <div onClick={() => setPieceToPromote(Piece.Knight)}>
            <ChessPiece boardPiece={{ color, piece: Piece.Knight }} />
          </div>
          <div onClick={() => setPieceToPromote(Piece.Bishop)}>
            <ChessPiece boardPiece={{ color, piece: Piece.Bishop }} />
          </div>
          <div onClick={() => setPieceToPromote(Piece.Rook)}>
            <ChessPiece boardPiece={{ color, piece: Piece.Rook }} />
          </div>
        </PopoverContent>
        <PopoverTrigger>
          <DraggablePiece row={row} col={col} boardPiece={{ color, piece }} />
        </PopoverTrigger>
      </Popover>
    );
  }
  return <DraggablePiece row={row} col={col} boardPiece={{ color, piece }} />;
};
