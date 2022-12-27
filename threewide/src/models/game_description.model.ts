import mongoose, { ObjectId, Types } from "mongoose";
import { BoardState, PieceType } from "src/types/tetris";

export interface Goal {
  linesCleared?: number | undefined;
  pointsGained?: number | undefined;
  tspinSingles?: number | undefined;
  tspinTriples?: number | undefined;
  tspinDoubles?: number | undefined;
  tspinMinis?: number | undefined;
  tspinMiniDoubles?: number | undefined;
  finalState?: BoardState | undefined;
  allowAllClears?: boolean | undefined;
}

interface GameDescription extends mongoose.Document<ObjectId>, Game {
  strategy: Types.ObjectId;
}

export interface Game {
  startingBoardState: BoardState;
  startingPieceQueue: PieceType[];
  goal: Goal;
  gameId: string;
  name: string;
}

const goalSchema = new mongoose.Schema({
  linesCleared: Number,
  pointsGained: Number,
  tspinSingles: Number,
  tspinTriples: Number,
  tspinDoubles: Number,
  tspinMini: Number,
  tspinMiniDouble: Number,
  finalState: [[String]],
});

const gameDescriptionSchema = new mongoose.Schema({
  startingBoardState: [[String]],
  startingPieceQueue: [String],
  goal: { type: goalSchema },
  name: String,
  types: Types.ObjectId,
});

const GameDescriptionModel: mongoose.Model<GameDescription> =
  mongoose.models.GameDescription ||
  mongoose.model<GameDescription>("GameDescription", gameDescriptionSchema);

export default GameDescriptionModel;
