import type { PieceType, Rotation } from "../../types/tetris";

const defaultKicktable: { [id: number]: { [id: number]: [number, number][] } } =
  {
    0: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
    },
    1: {
      1: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
    },
    2: {
      1: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
      3: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
    },
    3: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
      3: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
    },
  };

const default180KickTable: { [id: number]: [number, number][] } = {
  0: [
    [0, 0],
    [0, -1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ],
  1: [
    [0, 0],
    [1, 0],
    [1, -2],
    [1, -1],
    [0, -2],
    [0, -1],
  ],
  2: [
    [0, 0],
    [0, 1],
    [-1, 1],
    [1, 1],
    [-1, 0],
    [1, 0],
  ],
  3: [
    [0, 0],
    [-1, 0],
    [-1, -2],
    [-1, -1],
    [0, -2],
    [0, -1],
  ],
};

const iKickTable: { [id: number]: { [id: number]: [number, number][] } } = {
  0: {
    1: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [-2, 1],
      [1, -2],
    ],
    3: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [2, 1],
      [-1, -2],
    ],
  },
  1: {
    1: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, -2],
      [2, 1],
    ],
    3: [
      [0, 0],
      [-1, 0],
      [2, 0],
      [-1, -2],
      [2, -1],
    ],
  },
  2: {
    1: [
      [0, 0],
      [2, 0],
      [-1, 0],
      [2, -1],
      [-1, 2],
    ],
    3: [
      [0, 0],
      [-2, 0],
      [1, 0],
      [-2, -1],
      [1, 2],
    ],
  },
  3: {
    1: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, -1],
    ],
    3: [
      [0, 0],
      [1, 0],
      [-2, 0],
      [1, -2],
      [-2, 1],
    ],
  },
};

export type KickTable = [number, number][];

function getTableFromPieceAndRotation(
  pieceType: PieceType,
  currentRotation: Rotation,
  rotation: Rotation
): KickTable {
  if (rotation == 2) {
    return default180KickTable[currentRotation] as KickTable;
  } else if (pieceType == "I") {
    return (iKickTable[currentRotation] as KickTable[])[rotation] as KickTable;
  } else {
    return (defaultKicktable[currentRotation] as KickTable[])[
      rotation
    ] as KickTable;
  }
}

export { getTableFromPieceAndRotation };
