import {
  GetServerSideProps,
  GetServerSidePropsContext,
  type NextPage,
} from "next";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Tetris from "@components/Tetris";
import { BoardState, PieceType } from "src/types/tetris";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { Session, User } from "next-auth";
import SettingsPage, { Settings } from "@components/Settings";
import { dom } from "@fortawesome/fontawesome-svg-core";
import Header from "@components/Header";

const Home = (user: User) => {
  const [search, setSearch] = useState<string>("");

  const stratagies = trpc.strategy.search.useQuery({ name: search });

  const defaultUserSettings: Settings = {
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

  const startingBoardState: BoardState = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ] as unknown as BoardState;

  const userSettings = trpc.user.getUserSettings.useQuery({
    userId: user.name,
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
      userId: user.name,
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
    console.log(userSettings.data.settings);
    setSettings(userSettings.data.settings);
  }

  return (
    <>
      <Head>
        <title>Three wide</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <div
        className={
          showSettings ? "fixed z-20 h-[100%] w-[100%] bg-black/70" : ""
        }
      ></div>
      <Header addHomeIcon={false} addLogOutIcon={true} />
      <div className="flex w-full p-4">
        <div className="text-2x w-full justify-start pt-6">
          <input
            className="w-full border-2 border-black pl-1"
            placeholder="Search a strategy"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="p-1"></div>
          <div className="grid grid-cols-3 gap-2">
            {stratagies.data ? (
              stratagies.data.results?.map((result, index) => (
                <Link
                  href={`/strategy?name=${result.name}`}
                  className="select-none rounded-lg border-2 border-black bg-black text-center text-white hover:cursor-pointer hover:bg-white hover:text-black"
                  key={`result #${index}`}
                >
                  {result.name}
                </Link>
              ))
            ) : (
              <p className="text-xl">Loading..</p>
            )}
          </div>
        </div>
        <div className="ml-0 mr-auto">
          <SettingsPage
            showSettings={showSettings}
            onSettingsSave={onSettingsSaveHandler}
            onSettingCancel={onSettingCancelHandler}
            currentSettings={settings ?? defaultUserSettings}
          />
          <Tetris
            width={200}
            height={400}
            startingBoardState={startingBoardState}
            startingPieceQueue={startingBoardQueue}
            generatePieceQueue={true}
            settings={settings ?? defaultUserSettings}
            onShowSettings={onShowSettingsHandler}
          >
            {userSettings.data ? (
              <></>
            ) : (
              <p className="m-2 text-center text-white">Loading settings...</p>
            )}
          </Tetris>
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

export default Home;
