import { PieceType, Rotation } from "../../types/tetris";

//I PIECE

// X X X X
// O O O O
// X X X X
// X X X X

const IPIECE_0DEG: [number, number][] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
];

// X X O X
// X X O X
// X X O X
// X X O X

const IPIECE_90DEG: [number, number][] = [
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
];

// X X X X
// X X X X
// O O O O
// X X X X

const IPIECE_180DEG: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
];

// X O X X
// X O X X
// X O X X
// X O X X

const IPIECE_270DEG: [number, number][] = [
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
];

// J PIECE

// O X X
// O O O
// X X X
const JPIECE_0DEG: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
];

// X O O
// X O X
// X O X
const JPIECE_90DEG: [number, number][] = [
  [1, 0],
  [2, 0],
  [1, 1],
  [1, 2],
];

// X X X
// O O O
// X X O
const JPIECE_180DEG: [number, number][] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [2, 2],
];

// X O X
// X O X
// O O X
const JPIECE_270DEG: [number, number][] = [
  [0, 2],
  [1, 2],
  [1, 1],
  [1, 0],
];

// L PIECE

// X X O
// O O O
// X X X
const LPIECE_0DEG: [number, number][] = [
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
];
// X O X
// X O X
// X O O

const LPIECE_90DEG: [number, number][] = [
  [2, 2],
  [1, 2],
  [1, 1],
  [1, 0],
];

// X X X
// O O O
// O X X
const LPIECE_180DEG: [number, number][] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
];

// O O X
// X O X
// X O X
const LPIECE_270DEG: [number, number][] = [
  [1, 0],
  [0, 0],
  [1, 1],
  [1, 2],
];

// O PIECE
// This is the only piece without rotations

// O O
// O O
const OPIECE: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];

// S PIECE

// X O O
// O O X
// X X X
const SPIECE_0DEG: [number, number][] = [
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
];

// X O X
// X O O
// X X O
const SPIECE_90DEG: [number, number][] = [
  [1, 0],
  [1, 1],
  [2, 1],
  [2, 2],
];

// X X X
// X O O
// O O X
const SPIECE_180DEG: [number, number][] = [
  [0, 2],
  [1, 2],
  [1, 1],
  [2, 1],
];

// O X X
// O O X
// X O X
const SPIECE_270DEG: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
];

// T PIECE

// X O X
// O O O
// X X X
const TPIECE_0DEG: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [2, 1],
];

// X O X
// X O O
// X O X
const TPIECE_90DEG: [number, number][] = [
  [1, 0],
  [1, 1],
  [2, 1],
  [1, 2],
];

// X X X
// O O O
// X O X
const TPIECE_180DEG: [number, number][] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 2],
];

// X O X
// O O X
// X O X
const TPIECE_270DEG: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 2],
];

// S PIECE

// O O X
// X O O
// X X X
const ZPIECE_0DEG: [number, number][] = [
  [0, 0],
  [2, 1],
  [1, 0],
  [1, 1],
];

// X X O
// X O O
// X O X
const ZPIECE_90DEG: [number, number][] = [
  [2, 0],
  [1, 1],
  [2, 1],
  [1, 2],
];

// X X X
// O O X
// X O O
const ZPIECE_180DEG: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 1],
  [2, 2],
];

// X O X
// O O X
// O X X
const ZPIECE_270DEG: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, 2],
];

const TPIECE: { [id: number]: [number, number][] } = {
  0: TPIECE_0DEG,
  1: TPIECE_90DEG,
  2: TPIECE_180DEG,
  3: TPIECE_270DEG,
};

const IPIECE: { [id: number]: [number, number][] } = {
  0: IPIECE_0DEG,
  1: IPIECE_90DEG,
  2: IPIECE_180DEG,
  3: IPIECE_270DEG,
};

const JPIECE: { [id: number]: [number, number][] } = {
  0: JPIECE_0DEG,
  1: JPIECE_90DEG,
  2: JPIECE_180DEG,
  3: JPIECE_270DEG,
};

const LPIECE: { [id: number]: [number, number][] } = {
  0: LPIECE_0DEG,
  1: LPIECE_90DEG,
  2: LPIECE_180DEG,
  3: LPIECE_270DEG,
};

const SPIECE: { [id: number]: [number, number][] } = {
  0: SPIECE_0DEG,
  1: SPIECE_90DEG,
  2: SPIECE_180DEG,
  3: SPIECE_270DEG,
};

const ZPIECE: { [id: number]: [number, number][] } = {
  0: ZPIECE_0DEG,
  1: ZPIECE_90DEG,
  2: ZPIECE_180DEG,
  3: ZPIECE_270DEG,
};

function getTileLocationsFromPieceAndRotations(
  pieceType: PieceType,
  rotation: Rotation
): [number, number][] {
  let piece: [number, number][] | undefined;

  switch (pieceType) {
    case "T":
      piece = TPIECE[rotation];
      break;
    case "J":
      piece = JPIECE[rotation];
      break;
    case "I":
      piece = IPIECE[rotation];
      break;
    case "Z":
      piece = ZPIECE[rotation];
      break;
    case "S":
      piece = SPIECE[rotation];
      break;
    case "L":
      piece = LPIECE[rotation];
      break;
    default:
      piece = OPIECE;
  }
  if (!piece) return OPIECE;

  return piece;
}

export { getTileLocationsFromPieceAndRotations };
