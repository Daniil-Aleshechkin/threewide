import NextAuth, { type NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../../env/server.mjs";
import bcrypt from "bcrypt";
import UserModel, { UserDocument } from "src/models/user.model";
import connectMongo from "@utils/mongoose";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials, credentials?.username, credentials?.password);
        const username: string | undefined = credentials?.username;
        const password = credentials?.password;

        connectMongo();
        const user = await UserModel.findOne({ username: { $eq: username } });
        console.log("found USER", user);
        if (!password || !username)
          return new Error("Username and password is required");

        if (!user) {
          return signUpUser(password!, username!);
        }

        return signInUser(password!, user!);
      },
    }),
  ],
};

export default NextAuth(authOptions);

const signInUser = async (
  password: string,
  user: UserDocument
): Promise<User> => {
  const isMatch = await bcrypt.compare(password, user.password);
  //const isMatch = password == user.password;

  if (!isMatch) throw new Error("Pass don't match");

  return {
    id: user._id?.toString()!,
    name: user.username,
    email: "no email",
    image: "no image",
  };
};

// Next auth async type defs are trash so I have to do this terribleness
const signUpUser = async (password: string, username: string): Promise<any> => {
  if (!password) throw new Error("Password is required for auth");

  const salt = await bcrypt.genSalt(10);

  const passwordHash = await bcrypt.hash(password, salt);
  //const passwordHash = password;

  const newUser = await UserModel.create({
    username: username,
    password: passwordHash,
  });

  return {
    id: newUser._id,
    name: newUser.username,
    email: "no email",
    image: "no image",
  };
};
