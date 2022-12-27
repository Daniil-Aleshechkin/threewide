import { Goal } from "src/models/game_description.model";

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

export interface Points extends Goal {
  backToBackLevel: number;
}

export type BoardState = PieceType[23][10];
