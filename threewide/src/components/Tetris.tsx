import Board from "./Board";
import PieceQueue from "./PieceQueue";
import HoldPiece from "./HoldPiece";
import { getTileLocationsFromPieceAndRotations } from "@utils/tetris/PieceRotations";
import KeyListener from "./KeyListener";
import { getTableFromPieceAndRotation } from "@utils/tetris/PieceKickTables";
import {
  getPieceStartingLocationFromPieceTypeWithState,
  locationOutOfBound,
} from "@utils/tetris/PieceLocations";
import type {
  BoardState,
  PieceType,
  Points,
  Rotation,
  TetrisPiece,
} from "../types/tetris";
import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import type { Settings } from "./Settings";
import EndGame from "./EndGame";
import BoardPiece from "./BoardPiece";

const useDebounce = (
  val: DAS,
  dasTime: number,
  cancel: boolean,
  setCancel: (cancel: boolean) => void
) => {
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!cancel && val.direction != null && !val.enabled) {
      timer = setTimeout(() => setDebounceVal(val), dasTime);
      setCancel(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [val, cancel, setCancel, dasTime]);

  return debounceVal;
};

type TetrisProps = {
  width: number;
  height: number;
  startingBoardState: BoardState;
  startingPieceQueue: PieceType[];
  generatePieceQueue: boolean;
  settings: Settings;
  onPointGained?: (
    currentBoardState: BoardState,
    completedBoardState: BoardState,
    completedPiece: TetrisPiece,
    clearedLines: number,
    combo: number
  ) => Points;
  onGameEnd?: (
    finalBoardState: BoardState,
    lastPoints: Points | undefined
  ) => void;
  onShowSettings?: () => void;
  onGameNext?: () => void;
  onGamePrevious?: () => void;
  onGameReset?: () => void;
  isWin?: boolean;
  children?: ReactNode;
};

type HeldPiece = {
  pieceType: PieceType;
  hasHeldPiece: boolean;
};

type Direction = "left" | "right" | null;

type DAS = {
  direction: Direction;
  enabled: boolean;
};

const Tetris = ({
  width,
  height,
  startingBoardState,
  startingPieceQueue,
  generatePieceQueue,
  settings,
  onPointGained,
  onGameEnd,
  onShowSettings,
  onGameNext,
  onGamePrevious,
  onGameReset,
  isWin = false,
  children,
}: TetrisProps) => {
  const [isSoftDroping, setIsSoftDroping] = useState<boolean>(false);
  const [currentDAS, setCurrentDAS] = useState<DAS>({
    direction: null,
    enabled: false,
  });
  const [cancelDAS, setCancelDAS] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState(false);
  const deBouncedDAS = useDebounce(
    currentDAS,
    settings.dasAmount,
    cancelDAS,
    setCancelDAS
  );

  useEffect(() => {
    setCurrentDAS({ direction: deBouncedDAS.direction, enabled: true });

    if (deBouncedDAS.direction == "left") {
      movePieceLeft(10);
    } else if (deBouncedDAS.direction == "right") {
      movePieceRight(10);
    }
    // Disable because movePieceLeft and movePieceRight are used as functions and we do not want them to trigger the effect since we are waiting for the debouce effect to pass
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deBouncedDAS]);

  const isLeftDas = currentDAS.direction == "left" && currentDAS.enabled;
  const isRightDas = currentDAS.direction == "right" && currentDAS.enabled;

  const onDasPieceRightHandler = () => {
    if (currentDAS.enabled) movePieceRight(10);
  };

  const onDasPieceLeftHandler = () => {
    if (currentDAS.enabled) movePieceLeft(10);
  };

  const getPieceStartingLocationFromPieceType = useCallback(
    (pieceType: PieceType, newBoard: BoardState): [number, number] => {
      return getPieceStartingLocationFromPieceTypeWithState(
        pieceType,
        newBoard,
        isLeftDas,
        isRightDas,
        isSoftDroping
      );
    },
    [isLeftDas, isRightDas, isSoftDroping]
  );

  const [currentPiece, setCurrentPiece] = useState<TetrisPiece>({
    pieceType:
      startingPieceQueue.length == 0
        ? ""
        : (startingPieceQueue[0] as PieceType),
    pieceRotation: 0,
    pieceLocation: getPieceStartingLocationFromPieceType(
      startingPieceQueue[0] as PieceType,
      startingBoardState
    ),
    isSlamKicked: false,
  });

  const currentPieceRef = useRef<TetrisPiece>(currentPiece);

  const [combo, setCombo] = useState<number>(0);

  const [currentHeldPiece, setCurrentHeldPiece] = useState<HeldPiece>({
    pieceType: "",
    hasHeldPiece: false,
  });

  const copyBoard = (board: BoardState): BoardState => {
    const newBoard: PieceType[][] = [];

    for (const row of board) {
      const newRow: PieceType[] = [];
      for (const item of row) {
        newRow.push(item as PieceType);
      }
      newBoard.push(newRow);
    }
    return newBoard as unknown as BoardState;
  };

  const [board, setBoard] = useState<BoardState>(copyBoard(startingBoardState));
  const [queue, setQueue] = useState<PieceType[]>(startingPieceQueue.slice(1));

  const fillQueueWithBoard = useCallback(
    (queue: PieceType[], board: BoardState): PieceType[] => {
      if (generatePieceQueue && queue.length < 14) {
        let newQueue = [...queue];

        newQueue = newQueue.concat(generateBag());
        if (queue.length === 0) {
          const firstPiece = newQueue[0] as PieceType;
          const newPiece: TetrisPiece = {
            pieceType: firstPiece,
            pieceLocation: getPieceStartingLocationFromPieceTypeWithState(
              firstPiece,
              board,
              false,
              false,
              false
            ),
            pieceRotation: 0,
            isSlamKicked: false,
          };

          setCurrentPiece(newPiece);
          currentPieceRef.current = newPiece;

          newQueue = newQueue.slice(1);
        }

        newQueue = newQueue.concat(generateBag());

        return newQueue;
      } else {
        return queue;
      }
    },
    [generatePieceQueue]
  );

  const fillQueueWithDefaultBoard = useCallback(
    (queue: PieceType[]): PieceType[] =>
      fillQueueWithBoard(queue, startingBoardState),
    [fillQueueWithBoard, startingBoardState]
  );

  const fillQueue = (queue: PieceType[]): PieceType[] =>
    fillQueueWithBoard(queue, board);

  useEffect(() => {
    setQueue((q) => fillQueueWithDefaultBoard(q));
  }, [fillQueueWithDefaultBoard]);

  function generateBag(): PieceType[] {
    const pieces: PieceType[] = ["T", "S", "J", "L", "O", "Z", "I"];

    for (let i = 0; i < 7; i++) {
      const randIndex = Math.floor(Math.random() * 7);
      const tmp = pieces[i];
      pieces[i] = pieces[randIndex] as PieceType;
      pieces[randIndex] = tmp as PieceType;
    }

    return pieces;
  }

  function popPiece(): PieceType {
    const nextPiece = queue[0];
    let newQueue = queue.slice(1);

    if (generatePieceQueue && queue.length <= 14) {
      newQueue.concat(generateBag());
    } else if (newQueue.length == 0) {
      newQueue = [""];
    }

    newQueue = fillQueue(newQueue);
    setQueue(newQueue);
    return nextPiece as PieceType;
  }

  function onResetHandler() {
    if (onGameReset) onGameReset();
    setBoard(copyBoard(startingBoardState));

    const filledQueue = fillQueue(startingPieceQueue);
    setCurrentHeldPiece({
      pieceType: "",
      hasHeldPiece: false,
    });

    const newPiece: TetrisPiece = {
      pieceType: filledQueue[0] as PieceType,
      pieceLocation: getPieceStartingLocationFromPieceType(
        filledQueue[0] as PieceType,
        startingBoardState
      ),
      pieceRotation: 0,
      isSlamKicked: false,
    };
    setCurrentPiece(newPiece);
    currentPieceRef.current = newPiece;

    setQueue(filledQueue.slice(1));
    setGameOver(false);
  }

  function onHandleRotatePiece(rotation: Rotation): void {
    let newLocation = currentPieceRef.current.pieceLocation;
    const newRotation = ((currentPieceRef.current.pieceRotation + rotation) %
      4) as Rotation;

    if (isLeftDas) {
      newLocation = getPathFindPieceWithRotation(
        [-1, 0],
        [-4, newLocation[1]],
        newLocation,
        newRotation
      );
    } else if (isRightDas) {
      newLocation = getPathFindPieceWithRotation(
        [1, 0],
        [14, newLocation[1]],
        newLocation,
        newRotation
      );
    }

    const kickTables = getTableFromPieceAndRotation(
      currentPieceRef.current.pieceType,
      currentPieceRef.current.pieceRotation,
      rotation
    );

    let isSlamKicked = false;
    for (let i = 0; i < kickTables.length; i++) {
      const kickLocation: [number, number] = [
        newLocation[0] + (kickTables[i] as [number, number])[0],
        newLocation[1] + (kickTables[i] as [number, number])[1],
      ];

      if (isPieceMoveValidWithRotation(kickLocation, newRotation)) {
        newLocation = kickLocation;
        if (i > 1) isSlamKicked = true;
        break;
      } else if (i == kickTables.length - 1) {
        return;
      }
    }

    if (isSoftDroping) {
      newLocation = getPathFindPieceWithRotation(
        [0, 1],
        [newLocation[0], 20],
        newLocation,
        newRotation
      );
    }

    const newPiece: TetrisPiece = {
      ...currentPieceRef.current,
      pieceLocation: newLocation,
      pieceRotation: newRotation,
      isSlamKicked: isSlamKicked,
    };

    currentPieceRef.current = newPiece;
    setCurrentPiece(newPiece);
  }

  function onMovePieceRightHandler(): void {
    movePieceRight(1);

    setCancelDAS(true);
    setCancelDAS(false);
    setCurrentDAS({ direction: "right", enabled: false });
  }

  function onMovePieceLeftHandler(): void {
    movePieceLeft(1);

    setCancelDAS(true);
    setCancelDAS(false);
    setCurrentDAS({ direction: "left", enabled: false });
  }

  function onDasDisable(direction: Direction) {
    if (
      (direction == "left" && currentDAS.direction == "left") ||
      (direction == "right" && currentDAS.direction == "right")
    ) {
      setCancelDAS(true);
      setCurrentDAS({ direction: null, enabled: false });
    }
  }

  function movePieceLeft(amount: number) {
    let newLocation = getPathFindPiece(
      [-1, 0],
      [
        currentPieceRef.current.pieceLocation[0] - amount,
        currentPieceRef.current.pieceLocation[1],
      ],
      currentPieceRef.current.pieceLocation
    );

    if (isSoftDroping) {
      newLocation = getPathFindPiece([0, 1], [newLocation[0], 23], newLocation);
    }

    if (newLocation != currentPieceRef.current.pieceLocation) {
      const newPiece: TetrisPiece = {
        ...currentPieceRef.current,
        pieceLocation: newLocation,
        isSlamKicked: false,
      };

      currentPieceRef.current = newPiece;
      setCurrentPiece(newPiece);
    }
  }

  function movePieceRight(amount: number) {
    let newLocation = getPathFindPiece(
      [1, 0],
      [
        currentPieceRef.current.pieceLocation[0] + amount,
        currentPieceRef.current.pieceLocation[1],
      ],
      currentPieceRef.current.pieceLocation
    );

    if (isSoftDroping) {
      newLocation = getPathFindPiece([0, 1], [newLocation[0], 23], newLocation);
    }

    if (newLocation != currentPieceRef.current.pieceLocation) {
      const newPiece: TetrisPiece = {
        ...currentPieceRef.current,
        pieceLocation: newLocation,
        isSlamKicked: false,
      };

      currentPieceRef.current = newPiece;
      setCurrentPiece(newPiece);
    }
  }

  function getPathFindPiece(
    incrementor: [number, number],
    desiredLocation: [number, number],
    startingLocation: [number, number]
  ): [number, number] {
    let newLocation = startingLocation;

    while (
      isPieceMoveValid([
        newLocation[0] + incrementor[0],
        newLocation[1] + incrementor[1],
      ]) &&
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

  function getPathFindPieceWithRotation(
    incrementor: [number, number],
    desiredLocation: [number, number],
    startingLocation: [number, number],
    rotation: Rotation
  ): [number, number] {
    let newLocation = startingLocation;

    while (
      isPieceMoveValidWithRotation(
        [newLocation[0] + incrementor[0], newLocation[1] + incrementor[1]],
        rotation
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

  function isPieceMoveValid(location: [number, number]): boolean {
    const tileLocations: [number, number][] =
      getTileLocationsFromPieceAndRotations(
        currentPieceRef.current.pieceType,
        currentPieceRef.current.pieceRotation
      );

    for (const tileLocation of tileLocations) {
      if (
        locationOutOfBound([
          tileLocation[0] + location[0],
          tileLocation[1] + location[1] + 3,
        ]) ||
        (board[location[1] + tileLocation[1] + 3] as unknown as PieceType[])[
          location[0] + tileLocation[0]
        ] !== ""
      ) {
        return false;
      }
    }
    return true;
  }

  function isPieceMoveValidWithRotation(
    location: [number, number],
    rotation: Rotation
  ): boolean {
    const tileLocations: [number, number][] =
      getTileLocationsFromPieceAndRotations(
        currentPieceRef.current.pieceType,
        rotation
      );
    for (const tileLocation of tileLocations) {
      if (
        locationOutOfBound([
          tileLocation[0] + location[0],
          tileLocation[1] + location[1] + 3,
        ]) ||
        (board[location[1] + tileLocation[1] + 3] as unknown as PieceType[])[
          location[0] + tileLocation[0]
        ] !== ""
      ) {
        return false;
      }
    }
    return true;
  }

  function isPieceMoveValidWithRotationAndPieceType(
    location: [number, number],
    rotation: Rotation,
    pieceType: PieceType,
    newBoard: BoardState
  ): boolean {
    const tileLocations: [number, number][] =
      getTileLocationsFromPieceAndRotations(pieceType, rotation);
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

  function onHoldPiece(): void {
    if (currentHeldPiece.hasHeldPiece) return;

    if (currentHeldPiece.pieceType == "") {
      if (queue.length == 0 || queue[0] == "") return;
      setCurrentHeldPiece({
        pieceType: currentPieceRef.current.pieceType,
        hasHeldPiece: true,
      });

      const newPiece: TetrisPiece = {
        pieceType: queue[0] as PieceType,
        pieceLocation: getPieceStartingLocationFromPieceType(
          queue[0] as PieceType,
          board
        ),
        pieceRotation: 0,
        isSlamKicked: false,
      };
      currentPieceRef.current = newPiece;
      setCurrentPiece(newPiece);
      popPiece();
    } else {
      const heldPiece = currentHeldPiece.pieceType;
      setCurrentHeldPiece({
        pieceType: currentPieceRef.current.pieceType,
        hasHeldPiece: true,
      });
      const newPiece: TetrisPiece = {
        pieceType: heldPiece,
        pieceLocation: getPieceStartingLocationFromPieceType(heldPiece, board),
        pieceRotation: 0,
        isSlamKicked: false,
      };

      currentPieceRef.current = newPiece;
      setCurrentPiece(newPiece);
    }
  }

  const EMPTY_ROW: PieceType[] = ["", "", "", "", "", "", "", "", "", ""];

  function onHandlePlacePiece(): void {
    const placePieceLocation: [number, number] = getPathFindPiece(
      [0, 1],
      [currentPieceRef.current.pieceLocation[0], 23],
      currentPieceRef.current.pieceLocation
    );

    const tileLocations = getTileLocationsFromPieceAndRotations(
      currentPieceRef.current.pieceType,
      currentPieceRef.current.pieceRotation
    );

    for (const tileLocation of tileLocations) {
      (
        board[
          tileLocation[1] + placePieceLocation[1] + 3
        ] as unknown as PieceType[]
      )[tileLocation[0] + placePieceLocation[0]] =
        currentPieceRef.current.pieceType;
    }

    const removedYLocations = new Set<number>();
    for (const tileLocation of tileLocations) {
      const yLocationToCheck = tileLocation[1] + placePieceLocation[1] + 3;
      if (isRowFull(board[yLocationToCheck] as unknown as PieceType[])) {
        removedYLocations.add(yLocationToCheck);
      }
    }

    const newBoard: PieceType[][] = [];
    let clearedLines = 0;
    for (let row = 0; row < 23; row++) {
      if (removedYLocations.has(row)) {
        clearedLines += 1;
        newBoard.unshift([...EMPTY_ROW]);
      } else {
        newBoard.push([...(board[row] as PieceType)] as PieceType[]);
      }
    }

    let points: Points | undefined;

    if (onPointGained && clearedLines !== 0) {
      points = onPointGained(
        board,
        newBoard as unknown as BoardState,
        { ...currentPieceRef.current, pieceLocation: placePieceLocation },
        clearedLines,
        combo
      );
    }

    if (clearedLines == 0) {
      setCombo(0);
    } else {
      setCombo(combo + 1);
    }
    setBoard(newBoard as unknown as BoardState);
    setCurrentHeldPiece({ ...currentHeldPiece, hasHeldPiece: false });
    popPiece();

    if (
      (queue.length == 0 || queue[0] == "" || queue[0] == null) &&
      currentHeldPiece.pieceType == ""
    ) {
      if (onGameEnd) onGameEnd(newBoard as unknown as BoardState, points);
      setGameOver(true);
      const newPiece: TetrisPiece = {
        pieceType: queue[0] ?? "",
        pieceLocation: [0, 0],
        pieceRotation: 0,
        isSlamKicked: false,
      };
      currentPieceRef.current = newPiece;
      setCurrentPiece(newPiece);
      return;
    }

    const nextStartingLocation = getPieceStartingLocationFromPieceType(
      queue[0] as PieceType,
      newBoard as unknown as BoardState
    );

    if (
      !isPieceMoveValidWithRotationAndPieceType(
        nextStartingLocation,
        0,
        queue[0] as PieceType,
        newBoard as unknown as BoardState
      ) ||
      !isInBoard(placePieceLocation)
    ) {
      if (onGameEnd) onGameEnd(newBoard as unknown as BoardState, points);
      setGameOver(true);
      return;
    }

    const newPiece: TetrisPiece = {
      pieceType: queue[0] ?? "",
      pieceLocation: nextStartingLocation,
      pieceRotation: 0,
      isSlamKicked: false,
    };

    currentPieceRef.current = newPiece;
    setCurrentPiece(newPiece);
  }

  function isInBoard(placePieceLocation: [number, number]): boolean {
    let isInBoard = false;

    const tileLocations = getTileLocationsFromPieceAndRotations(
      currentPieceRef.current.pieceType,
      currentPieceRef.current.pieceRotation
    );

    for (const tileLocation of tileLocations) {
      if (tileLocation[1] + placePieceLocation[1] >= 0) {
        isInBoard = true;
      }
    }

    return isInBoard;
  }

  function onSoftDropHandler(): void {
    setIsSoftDroping(true);

    const softDropLocation = getPathFindPiece(
      [0, 1],
      [currentPieceRef.current.pieceLocation[0], 20],
      currentPieceRef.current.pieceLocation
    );

    if (
      softDropLocation[0] == currentPieceRef.current.pieceLocation[0] &&
      softDropLocation[1] == currentPieceRef.current.pieceLocation[1]
    )
      return;
    const newPiece: TetrisPiece = {
      ...currentPieceRef.current,
      pieceLocation: softDropLocation,
      isSlamKicked: false,
    };
    currentPieceRef.current = newPiece;
    setCurrentPiece(newPiece);
  }

  function onSoftDropDisable(): void {
    setIsSoftDroping(false);
  }

  function isRowFull(row: PieceType[]): boolean {
    for (const tile of row) {
      if (tile === "") return false;
    }
    return true;
  }

  const shadowPieceLocation = getPathFindPiece(
    [0, 1],
    [currentPieceRef.current.pieceLocation[0], 20],
    currentPieceRef.current.pieceLocation
  );

  const tileDimensions = { height: 20, width: 20 };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 200, 460);
  };

  const drawCurrentPiece = BoardPiece({
    location: currentPiece.pieceLocation,
    tileDimensions: tileDimensions,
    pieceType: currentPiece.pieceType,
    rotation: currentPiece.pieceRotation,
  });

  const drawShadowPiece = BoardPiece({
    location: shadowPieceLocation,
    tileDimensions: tileDimensions,
    isShadowPiece: true,
    pieceType: currentPiece.pieceType,
    rotation: currentPiece.pieceRotation,
  });

  const drawBoard = Board({
    width: (width / 10) as number,
    height: (height / 20) as number,
    boardState: board,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        clearBoard(context);
        drawBoard(context);
        drawShadowPiece(context);
        drawCurrentPiece(context);
      }
    }
  }, [drawCurrentPiece, drawBoard, drawShadowPiece]);

  return (
    <KeyListener
      gameOver={gameOver}
      onSoftDropDisable={onSoftDropDisable}
      onHoldPieceHandler={onHoldPiece}
      onSoftDropHandler={onSoftDropHandler}
      onDasDisable={onDasDisable}
      onMovePieceLeftHandler={onMovePieceLeftHandler}
      onMovePieceRightHandler={onMovePieceRightHandler}
      onDasPieceRightHandler={onDasPieceRightHandler}
      onDasPieceLeftHandler={onDasPieceLeftHandler}
      onHardDropHandler={onHandlePlacePiece}
      onRotatePieceHandler={onHandleRotatePiece}
      onResetHandler={onResetHandler}
      onNextGame={onGameNext}
      onPreviousGame={onGamePrevious}
      settings={settings}
    >
      <div className="mt-20 flex">
        <div className="mt-20 w-20">
          <HoldPiece
            tileDimensions={{ width: 15, height: 15 }}
            pieceType={currentHeldPiece.pieceType}
            rotation={0}
          />
        </div>

        <div className="relative">
          <div className="absolute top-[35%] left-0 w-full bg-gray-400/95">
            {children}
            <EndGame
              onGameReset={onResetHandler}
              onNextGame={onGameNext}
              onPreviousGame={onGamePrevious}
              isWin={isWin}
              gameOver={gameOver}
            />
          </div>
          <canvas width={200} height={460} ref={canvasRef}></canvas>
        </div>
        <div className="mt-10">
          <PieceQueue queue={queue} />
          <FontAwesomeIcon
            className="border-1 mb-0 mt-auto border-red-500 hover:cursor-pointer"
            size="3x"
            icon={faCog}
            onClick={onShowSettings}
          />
        </div>
      </div>
    </KeyListener>
  );
};

export default Tetris;
