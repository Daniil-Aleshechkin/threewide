import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import type { MouseEvent } from "react";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { User } from "next-auth";
import { useRouter } from "next/router";
import type { Game } from "src/models/game_description.model";
import TetrisGame from "@components/Game";
import type { UserGame } from "src/server/trpc/router/gameDescription";
import Header from "@components/Header";
import { dom } from "@fortawesome/fontawesome-svg-core";
import type { Settings } from "@components/Settings";

type ActiveGame = {
  game: Game;
  isCompleted: boolean;
  onNextGameHandler?: () => void;
  onPreviousGameHandler?: () => void;
};

const Strategy = (user: User) => {
  const router = useRouter();
  const [overlay, setOverlay] = useState(false);

  const [activeGame, setActiveGame] = useState<ActiveGame | undefined>();

  const stratName: string = router.query.name as string;

  const gameDescriptions = trpc.gameDescription.getGames.useQuery({
    name: stratName,
    userId: user.name ?? null,
  });

  const defaultSettings: Settings = {
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
    },
    dasAmount: 80,
  };

  const userSettings = trpc.user.getUserSettings.useQuery({
    userId: user.name,
  });

  const saveUserSettings = trpc.user.saveUserSettings.useMutation();

  const [settings, setSettings] = useState<Settings | undefined>(
    userSettings.data?.settings
  );

  if (
    userSettings.data &&
    userSettings?.data.settings != null &&
    !userSettings.data.error &&
    !settings
  ) {
    setSettings(userSettings.data.settings);
  }

  const userGameResult = trpc.userGameResult.createUserGameResult.useMutation();

  const updateGameWith = (index: number) => {
    const games = gameDescriptions?.data?.games;
    if (!games) return;
    const game = games[index];
    if (!game) return;

    const gameCopy: Game = {
      startingBoardState: game.startingBoardState,
      startingPieceQueue: [...game.startingPieceQueue],
      goal: game.goal,
      gameId: game.gameId,
      name: game.name,
    };

    const onNextGameHandler =
      index + 1 == (gameDescriptions.data?.games?.length ?? 0)
        ? undefined
        : () => updateGameWith(index + 1);

    const onPreviousGameHandler =
      index == 0 ? undefined : () => updateGameWith(index - 1);

    setActiveGame({
      game: gameCopy,
      isCompleted: game.isCompleted,
      onNextGameHandler,
      onPreviousGameHandler,
    });
  };

  const onGameWin = (): void => {
    if (!gameDescriptions.data || !activeGame || !gameDescriptions.data.games)
      return;

    if (!user.name) return;

    userGameResult.mutate({
      userId: user.name,
      gameId: activeGame.game.gameId,
      isCompleted: true,
    });

    const game = gameDescriptions.data.games.filter(
      (game) => game.gameId == activeGame.game.gameId
    )[0];

    if (!game) return;

    game.isAttempted = true;
    game.isCompleted = true;
  };

  const onGameLose = (): void => {
    if (!gameDescriptions.data || !activeGame || !gameDescriptions.data.games)
      return;

    if (!user.name) return;

    if (!activeGame.isCompleted)
      userGameResult.mutate({
        userId: user.name,
        gameId: activeGame.game.gameId,
        isCompleted: false,
      });

    const game = gameDescriptions.data.games.filter(
      (game) => game.gameId == activeGame.game.gameId
    )[0];

    if (!game) return;

    game.isAttempted = true;
  };

  const clickRandom = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void => {
    e.preventDefault();
    if (!gameDescriptions.data || !gameDescriptions.data.games) return;

    const randomIndex = Math.floor(
      gameDescriptions.data.games.length * Math.random()
    );

    updateGameWith(randomIndex);
  };

  const onOverlayToggle = (over: boolean) => {
    setOverlay(over);
  };

  const onSettingsUpdateHandler = (newSettings: Settings) => {
    saveUserSettings.mutate({
      userId: user.name,
      settings: newSettings,
    });

    setSettings(newSettings);
  };

  return (
    <>
      <Head>
        <title>{`Threewide ${stratName}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <div
        className={overlay ? "fixed z-20 h-[100%] w-[100%] bg-black/70" : ""}
      ></div>
      <Header addHomeIcon={true} addLogOutIcon={true} />
      <div className="flex w-full p-4">
        <div className="flex w-full flex-col justify-start pt-6 text-2xl text-blue-500"></div>
        <div className="ml-0 mr-auto">
          <h1 className="mb-4 text-center text-2xl capitalize">
            {activeGame?.game.name ?? "Practice mode"}
          </h1>
          <TetrisGame
            key={`Active game: ${activeGame?.game.name}`}
            game={activeGame?.game}
            onGameLose={onGameLose}
            onGameWin={onGameWin}
            onOverlayToggle={onOverlayToggle}
            settings={settings ?? defaultSettings}
            onSettingsUpdate={onSettingsUpdateHandler}
            onGameNext={activeGame?.onNextGameHandler}
            onGamePrevious={activeGame?.onPreviousGameHandler}
          >
            {userSettings.data ? (
              <></>
            ) : (
              <p className="m-2 text-center text-white">Loading settings...</p>
            )}
          </TetrisGame>

          <div className="mt-3 grid grid-cols-3">
            {gameDescriptions.data ? (
              gameDescriptions.data.games?.map(
                (game: UserGame, index: number) => (
                  <p
                    key={`game ${index}`}
                    className={`mr-2 ml-2 select-none rounded-lg border-2 text-center text-white hover:cursor-pointer hover:bg-white ${
                      game.isCompleted
                        ? "border-green-500 bg-green-500 hover:text-green-500"
                        : game.isAttempted
                        ? "border-yellow-500 bg-yellow-500 hover:text-yellow-500"
                        : "border-black bg-black hover:text-black"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      updateGameWith(index);
                    }}
                  >
                    {game.name}
                  </p>
                )
              )
            ) : (
              <p> Loading... </p>
            )}
          </div>
          <div className="mt-3 grid grid-cols-3">
            <div className="mr-2 ml-2"></div>
            <div
              onClick={(e) => clickRandom(e)}
              className="mr-2 ml-2 select-none rounded-lg border-2 border-black bg-black text-center text-white hover:cursor-pointer hover:bg-white hover:text-black"
            >
              Random
            </div>
            <div className="mr-2 ml-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session || !session?.user?.name) {
    return {
      redirect: { destination: "/login" },
      props: {},
    };
  }
  return {
    props: session.user,
  };
};

export default Strategy;
