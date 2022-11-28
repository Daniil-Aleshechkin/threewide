import React from "react";
import BoardTile from "./BoardTile";
import {
  ITile,
  JTile,
  LTile,
  STile,
  ZTile,
  OTile,
  TTile,
  DefaultTile,
} from "@public/BoardTiles";
import { PieceType } from "src/types/tetris";

type BoardProperties = {
  width: number;
  height: number;
  boardState: PieceType[][];
  children?: any;
};

function Board({ width, height, boardState, children }: BoardProperties) {
  const TILE_HEIGHT = height / 20;
  const TILE_WIDTH = width / 10;

  function getTextureFromBoardStateTile(boardTile: PieceType) {
    let tile;

    switch (boardTile) {
      case "T":
        tile = TTile;
        break;
      case "I":
        tile = ITile;
        break;
      case "J":
        tile = JTile;
        break;
      case "L":
        tile = LTile;
        break;
      case "S":
        tile = STile;
        break;
      case "Z":
        tile = ZTile;
        break;
      case "O":
        tile = OTile;
        break;
      default:
        tile = DefaultTile;
        break;
    }
    return tile;
  }

  function getBoardSprites(boardState: PieceType[][]) {
    const boardSprites: JSX.Element[] = [];

    boardState.forEach((boardRow, posY) => {
      if (posY < 3) return;
      boardRow.forEach((boardTile, posX) => {
        boardSprites.push(
          <BoardTile
            key={`${posX} ${posY - 3}`}
            tileDimensions={{ height: TILE_WIDTH, width: TILE_HEIGHT }}
            texture={getTextureFromBoardStateTile(boardTile)}
          />
        );
      });
    });

    return boardSprites;
  }

  const displayChildren = () => {
    if (children)
      return (
        <div className="absolute top-[30%] w-full bg-gray-500 text-white">
          {children}
        </div>
      );
  };

  return (
    <div
      id="board"
      className="grid-rows-20 relative z-0 grid min-w-min grid-cols-[repeat(10,20px)] gap-0"
    >
      {displayChildren()}

      {getBoardSprites(boardState)}
    </div>
  );
}

export default Board;