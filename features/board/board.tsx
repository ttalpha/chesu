"use client";
import { DndContext, useDndMonitor } from "@dnd-kit/core";
import { BoardCell } from "./cell";
import { useGameStore } from "./hooks";
import { useState } from "react";
import { Color, Piece, PieceMetadata } from "./types";
import { generateMoves } from "./utils";
import {
  FIRST_BLACK_KING_POSITION,
  FIRST_WHITE_KING_POSITION,
} from "./constants";

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
  const changeTurn = useGameStore.getState().changeTurn;
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [whiteKingPosition, setWhiteKingPosition] = useState<[number, number]>(
    FIRST_WHITE_KING_POSITION
  );
  const [blackKingPosition, setBlackKingPosition] = useState<[number, number]>(
    FIRST_BLACK_KING_POSITION
  );

  useDndMonitor({
    onDragStart(event) {
      const { row, col, boardPiece } = event.active.data
        .current as PieceMetadata;
      if (boardPiece.color !== currentTurn) setValidMoves([]);
      else
        setValidMoves(
          generateMoves(
            {
              board,
              color: currentTurn,
              kingPosition:
                currentTurn === Color.White
                  ? whiteKingPosition
                  : blackKingPosition,
              currentPosition: [row, col],
            },
            boardPiece.piece
          )
        );
    },
    onDragEnd(event) {
      if (!event.over?.id) return;
      const { row, col, boardPiece } = event.active.data
        .current as PieceMetadata;
      if (boardPiece.color !== currentTurn) return;
      const [newRow, newCol] = event.over.id.toString().split("-");
      if (validMoves.some(([x, y]) => +newRow === x && +newCol === y)) {
        if (boardPiece.piece === Piece.King) {
          if (boardPiece.color === Color.White)
            setWhiteKingPosition([+newRow, +newCol]);
          if (boardPiece.color === Color.Black)
            setBlackKingPosition([+newRow, +newCol]);
        }
        setValidMoves([]);
        movePiece([row, col], [+newRow, +newCol]);
        changeTurn();
      }
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
