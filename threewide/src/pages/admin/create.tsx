import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Head from "next/head";
import Header from "@components/Header";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import Tetris from "@components/Tetris";
import type { User } from "next-auth";
import type { PieceType } from "src/types/tetris";
import type { Settings } from "@components/Settings";
import { useState } from "react";
import { trpc } from "@utils/trpc";
import {
  defaultUserSettings,
  startingBoardState,
} from "@utils/tetris/StartingStates";
import SettingsPage from "@components/Settings";
config.autoAddCss = false;

const Create = (user: User) => {
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
      <Header addHomeIcon={false} addLogOutIcon={false} />
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
      />
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

  if (!session.isAdmin) {
    return {
      redirect: { destination: "/" },
      props: {},
    };
  }

  return {
    props: session.user,
  };
};

export default Create;
