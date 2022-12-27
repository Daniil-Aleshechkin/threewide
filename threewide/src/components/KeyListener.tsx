import React, { useEffect, useRef } from "react";
import type { KeyboardEventHandler, ReactNode } from "react";
import { useState } from "react";
import type { Moves, Rotation } from "src/types/tetris";
import { Settings } from "./Settings";

type Direction = "left" | "right" | null;

type KeyListenerEventHandlers = {
  gameOver: boolean;
  onSoftDropDisable: () => void;
  onDasDisable: (direction: Direction) => void;
  onMovePieceLeftHandler: () => void;
  onMovePieceRightHandler: () => void;
  onHardDropHandler: () => void;
  onHoldPieceHandler: () => void;
  onSoftDropHandler: () => void;
  onRotatePieceHandler: (rotation: Rotation) => void;
  onResetHandler: () => void;
  onNextGame?: () => void;
  onPreviousGame?: () => void;
  settings: Settings;
  children: ReactNode;
};

const KeyListener = ({
  gameOver,
  onSoftDropDisable,
  onDasDisable,
  onMovePieceLeftHandler,
  onMovePieceRightHandler,
  onHardDropHandler,
  onSoftDropHandler,
  onHoldPieceHandler,
  onRotatePieceHandler,
  onResetHandler,
  onNextGame,
  onPreviousGame,
  settings,
  children,
}: KeyListenerEventHandlers) => {
  const controls: { [id: string]: Moves } = Object.fromEntries(
    Object.entries(settings.keySettings).map(
      ([key, value]: [string, string]): [string, Moves] => [value, key as Moves]
    )
  );

  const handlers: { [id: string]: (() => void) | undefined } = {
    moveLeft: onMovePieceLeftHandler,
    moveRight: onMovePieceRightHandler,
    holdPiece: onHoldPieceHandler,
    rotate90: () => onRotatePieceHandler(1),
    rotate180: () => onRotatePieceHandler(2),
    rotate270: () => onRotatePieceHandler(3),
    softDrop: onSoftDropHandler,
    hardDrop: onHardDropHandler,
    reset: onResetHandler,
    next: onNextGame,
    previous: onPreviousGame,
  };

  const onKeyUpHandler: KeyboardEventHandler = (event) => {
    const move: Moves | undefined = controls[event.code];

    if (move == "moveLeft") {
      onDasDisable("left");
    } else if (move == "moveRight") {
      onDasDisable("right");
    } else if (move == "softDrop") {
      onSoftDropDisable();
    }

    setCurrentActions((actions) => {
      return [...actions.filter((action) => action != move)];
    });
  };

  const onKeyDownHandler: KeyboardEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const move: Moves | undefined = controls[event.code];

    if (gameOver && move != "reset" && move != "next" && move != "previous")
      return;

    if (move === undefined) return;

    if (
      currentActions.filter((action) => action == move).length == 0 &&
      handlers[move]
    ) {
      setCurrentActions((actions: Moves[]): Moves[] => {
        return [move, ...actions];
      });

      const handler = handlers[move];
      if (handler) handler();
    }
  };

  const [currentActions, setCurrentActions] = useState<Moves[]>([]);

  const listener = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listener.current) {
      listener.current.focus();
    }
  }, [listener.current]);

  return (
    <div
      ref={listener}
      tabIndex={0}
      className="!outline-none"
      onKeyDown={onKeyDownHandler}
      onKeyUp={onKeyUpHandler}
    >
      {children}
    </div>
  );
};

export default KeyListener;
