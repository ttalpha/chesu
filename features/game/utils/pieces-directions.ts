import { Color, Piece } from "../types";

const piecesDirection = {
  [Piece.Rook]: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  [Piece.Knight]: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  [Piece.Bishop]: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  [Piece.Queen]: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  [Piece.King]: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
};

export const getPiecesDirection = (piece: Piece, kingColor: Color) => {
  if (piece === Piece.Pawn)
    return kingColor === Color.White
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];
  return piecesDirection[piece];
};
