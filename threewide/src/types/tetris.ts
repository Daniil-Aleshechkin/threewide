export type Rotation = 0 | 1 | 2 | 3;

export type PieceType = "T" | "S" | "Z" | "L" | "O" | "J" | "I" | "";

export type Moves =
  | "moveLeft"
  | "moveRight"
  | "rotate90"
  | "rotate180"
  | "rotate270"
  | "holdPiece"
  | "softDrop"
  | "hardDrop"
  | "reset"
  | "previous"
  | "next";

export type TetrisPiece = {
  pieceType: PieceType;
  pieceRotation: Rotation;
  pieceLocation: [number, number];
  isSlamKicked: boolean;
};

export interface Points {
  linesCleared: number;
  pointsGained: number;
  tspinSingles: number;
  tspinTriples: number;
  tspinDoubles: number;
  tspinMinis: number;
  tspinMiniDoubles: number;
  backToBackLevel: number;
}

export type BoardState = PieceType[23][10];
