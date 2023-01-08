import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Head from "next/head";
import Header from "@components/Header";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
config.autoAddCss = false;

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Three wide</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <Header addHomeIcon={false} addLogOutIcon={false} />
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

export default Login;
