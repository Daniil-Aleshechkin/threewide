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
import ColorSelector from "@components/ColorSelector";
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
import GameCreator from "@components/GameCreator";
config.autoAddCss = false;

const Create = (user: User) => {
  if (!user.name) return;
  return (
    <>
      <Head>
        <title>Three wide</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <Header addHomeIcon={false} addLogOutIcon={false} />
      <GameCreator userId={user.name} />
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
