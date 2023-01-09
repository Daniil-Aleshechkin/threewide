import type { Settings } from "@components/Settings";
import type { BoardState } from "src/types/tetris";

const startingBoardState: BoardState = [
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
] as unknown as BoardState;

const defaultUserSettings: Settings = {
  keySettings: {
    moveLeft: "ArrowLeft",
    moveRight: "ArrowRight",
    rotate180: "KeyQ",
    rotate270: "KeyW",
    rotate90: "ArrowUp",
    holdPiece: "Tab",
    hardDrop: "KeyD",
    softDrop: "ArrowDown",
    reset: "KeyR",
    next: "KeyY",
    previous: "KeyT",
    undo: "KeyE",
  },
  dasAmount: 80,
};

export { startingBoardState, defaultUserSettings };
