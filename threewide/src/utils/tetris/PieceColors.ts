import type { PieceType } from "src/types/tetris";

const getColorFromBoardStateTile = (boardTile: PieceType) => {
  let tile;

  switch (boardTile) {
    case "T":
      tile = "#c60eff";
      break;
    case "I":
      tile = "#55ffd7";
      break;
    case "J":
      tile = "#2316ff";
      break;
    case "L":
      tile = "#f79c00";
      break;
    case "S":
      tile = "#5ad700";
      break;
    case "Z":
      tile = "#f30000";
      break;
    case "O":
      tile = "#fdf900";
      break;
    default:
      tile = "#000000";
      break;
  }
  return tile;
};

export { getColorFromBoardStateTile };
