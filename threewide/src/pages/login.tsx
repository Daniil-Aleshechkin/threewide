import {
  faLock,
  faUser,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "@components/Header";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const Login: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const signInUser = async () => {
    setIsSigningIn(true);
    const signInOptions = { redirect: false, username, password };
    const res = await signIn("credentials", signInOptions);
    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      return await router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Three wide</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <Header addHomeIcon={false} addLogOutIcon={false} />
      <div className="p-5"></div>
      <div className="text-center text-4xl">Welcome To ThreeWide</div>
      <p className="m-3 text-center text-lg">
        Playing tetris for 15 minutes is like meditation
      </p>
      <div className="flex items-center justify-center">
        <div className="flex w-fit flex-col items-center justify-center">
          <label className="text-center text-lg" htmlFor="">
            Username
          </label>

          <div className="flex w-fit items-center justify-center rounded border-2 border-gray-400 text-2xl">
            <FontAwesomeIcon
              className="mr-3 ml-3 text-gray-400"
              icon={faUser}
              size="xs"
            />
            <input
              type="text"
              name="username"
              className="p-1"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <label className="text-center text-lg" htmlFor="">
            Password
          </label>
          <div className="flex w-fit items-center justify-center rounded border-2 border-gray-400 text-2xl">
            <FontAwesomeIcon
              className="mr-3 ml-3 text-gray-400"
              icon={faLock}
              size="xs"
            />
            <input
              type="password"
              className="p-1"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="mt-10 w-full border-2 border-black bg-black p-1 text-xl text-white hover:cursor-pointer hover:bg-white hover:text-black"
            onClick={() => signInUser()}
          >
            {!isSigningIn ? (
              "START"
            ) : (
              <FontAwesomeIcon
                className="mr-3 ml-3"
                spin={true}
                icon={faCircleNotch}
                size="lg"
              />
            )}
          </button>
          <div>{errorMessage}</div>
        </div>
      </div>
    </>
  );
};

export default Login;
