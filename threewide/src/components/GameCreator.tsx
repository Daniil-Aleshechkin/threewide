import type {
  BoardState,
  HeldPiece,
  PieceType,
  Rotation,
  TetrisPiece,
} from "src/types/tetris";
import { trpc } from "@utils/trpc";
import { useRef, useState } from "react";
import SettingsPage, { Settings } from "./Settings";
import {
  defaultUserSettings,
  startingBoardState,
} from "@utils/tetris/StartingStates";
import Tetris, { TetrisRef } from "./Tetris";
import ColorSelector from "./ColorSelector";

type GameCreatorProps = {
  userId: string;
};

const GameCreator = ({ userId }: GameCreatorProps) => {
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType>("");
  
  const tetrisRef = useRef<TetrisRef>(null);

  const userSettings = trpc.user.getUserSettings.useQuery({
    userId: userId,
  });

  const startingBoardQueue: PieceType[] = [];

  const saveUserSettings = trpc.user.saveUserSettings.useMutation();

  const [settings, setSettings] = useState<Settings | undefined>();

  const [showSettings, setShowSettings] = useState(false);

  const onShowSettingsHandler = () => {
    if (!userSettings.data || !userSettings.data.settings) {
      return;
    }

    setShowSettings(true);
  };

  const onSettingCancelHandler = () => {
    setShowSettings(false);
  };

  const onSettingsSaveHandler = (newSettings: Settings) => {
    saveUserSettings.mutate({
      userId: userId,
      settings: newSettings,
    });

    setSettings(newSettings);
    setShowSettings(false);
  };

  if (
    userSettings.data &&
    userSettings?.data.settings != null &&
    !userSettings.data.error &&
    !settings
  ) {
    setSettings(userSettings.data.settings);
  }

  const onSelectColorHandler = (color: PieceType) => {
    if (selectedPieceType == color) {
      setSelectedPieceType("");
    } else {
      setSelectedPieceType(color);
    }
  };

  const onSelectBoardHandler = (yMouse: number, xMouse: number) => {
    let yLocation = Math.floor(yMouse / 20);
    let xLocation = Math.floor(xMouse / 20);
    console.log(xLocation, yLocation, xMouse, yMouse);
    if (yLocation < 0 || yLocation >= 23 || xLocation < 0 || xLocation >= 10) {
      return;
    }

    let newBoard = copyBoard(tetrisRef.current?.board as unknown as BoardState) as unknown as PieceType[][];
    (newBoard[yLocation] as unknown as PieceType[])[xLocation] =
      selectedPieceType;
    console.log(newBoard);
    tetrisRef.current?.setBoard(newBoard as unknown as BoardState);
  };

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
  
  return (
    <>
      <div
        className={
          showSettings ? "fixed z-20 h-[100%] w-[100%] bg-black/70" : ""
        }
      ></div>
      <SettingsPage
        showSettings={showSettings}
        onSettingsSave={onSettingsSaveHandler}
        onSettingCancel={onSettingCancelHandler}
        currentSettings={settings ?? defaultUserSettings}
      />
      <div className="flex flex-col items-center justify-center">
        <Tetris
          ref={tetrisRef}
          width={200}
          height={400}
          startingBoardState={startingBoardState}
          startingPieceQueue={startingBoardQueue}
          generatePieceQueue={true}
          settings={settings ?? defaultUserSettings}
          onShowSettings={onShowSettingsHandler}
          onBoardClick={onSelectBoardHandler}
        />
        <ColorSelector
          key={`Selected ${selectedPieceType}`}
          selectedPieceType={selectedPieceType}
          onSelectColor={onSelectColorHandler}
        />
      </div>
    </>
  );
};

export default GameCreator;