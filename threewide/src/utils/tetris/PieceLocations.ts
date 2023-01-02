import { BoardState, PieceType } from "src/types/tetris";
import { getTileLocationsFromPieceAndRotations } from "./PieceRotations";

const getPieceStartingLocationFromPieceTypeWithState = (
  pieceType: PieceType,
  newBoard: BoardState,
  isLeftDas: boolean,
  isRightDas: boolean,
  isSoftDroping: boolean
): [number, number] => {
  let startingYLocation = -3;

  let startingXLocation = 3;

  if (pieceType == "O") startingXLocation = 4;

  if (isLeftDas ?? false) {
    startingXLocation = getPathFindPieceWithPieceType(
      [-1, 0],
      [-4, startingYLocation],
      [startingXLocation, startingYLocation],
      pieceType,
      newBoard
    )[0];
  } else if (isRightDas ?? false) {
    startingXLocation = getPathFindPieceWithPieceType(
      [1, 0],
      [14, startingYLocation],
      [startingXLocation, startingYLocation],
      pieceType,
      newBoard
    )[0];
  }

  if (isSoftDroping) {
    startingYLocation =
      getPathFindPieceWithPieceType(
        [0, 1],
        [startingXLocation, 23],
        [startingXLocation, 0],
        pieceType,
        newBoard
      )[1] - 3;
  }

  return [startingXLocation, startingYLocation];
};

function getPathFindPieceWithPieceType(
  incrementor: [number, number],
  desiredLocation: [number, number],
  startingLocation: [number, number],
  pieceType: PieceType,
  newBoard: BoardState
): [number, number] {
  let newLocation = startingLocation;

  while (
    isPieceMoveValidWithPieceType(
      [newLocation[0] + incrementor[0], newLocation[1] + incrementor[1]],
      pieceType,
      newBoard
    ) &&
    (desiredLocation[0] != newLocation[0] ||
      desiredLocation[1] != newLocation[1])
  ) {
    newLocation = [
      newLocation[0] + incrementor[0],
      newLocation[1] + incrementor[1],
    ];
  }

  return newLocation;
}

function isPieceMoveValidWithPieceType(
  location: [number, number],
  pieceType: PieceType,
  newBoard: BoardState
): boolean {
  const tileLocations: [number, number][] =
    getTileLocationsFromPieceAndRotations(pieceType, 0);
  for (const tileLocation of tileLocations) {
    if (
      locationOutOfBound([
        tileLocation[0] + location[0],
        tileLocation[1] + location[1] + 3,
      ]) ||
      (newBoard[location[1] + tileLocation[1] + 3] as unknown as PieceType[])[
        location[0] + tileLocation[0]
      ] !== ""
    ) {
      return false;
    }
  }
  return true;
}

function locationOutOfBound(location: [number, number]): boolean {
  return (
    location[0] < 0 || location[1] < 0 || location[0] >= 10 || location[1] >= 23
  );
}

export {
  getPieceStartingLocationFromPieceTypeWithState,
  locationOutOfBound,
  isPieceMoveValidWithPieceType,
};
