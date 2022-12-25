import type { PieceType } from "src/types/tetris";
import { getColorFromBoardStateTile } from "@utils/tetris/PieceColors";

type BoardProperties = {
  width: number;
  height: number;
  boardState: PieceType[23][10];
};

function Board({ width, height, boardState }: BoardProperties) {
  const draw = (ctx: CanvasRenderingContext2D) => {
    for (let rowNum = 3; rowNum < 23; rowNum++) {
      for (let colNum = 0; colNum < 10; colNum++) {
        ctx.fillStyle = getColorFromBoardStateTile(
          (boardState[rowNum] as PieceType[23])[colNum] as PieceType
        );
        ctx.fillRect(colNum * width, rowNum * height, width, height);
      }
    }
  };

  return draw;
}

export default Board;
