import NextAuth, { type NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import UserModel from "src/models/user.model";
import type { ThreeWideUser, UserDocument } from "src/models/user.model";
import connectMongo from "@utils/mongoose";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session }) {
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
        const username: string | undefined = credentials?.username;
        const password: string | undefined = credentials?.password;

        connectMongo();
        const user: UserDocument | null = await UserModel.findOne({
          username: { $eq: username },
        });
        if (!password || !username)
          throw new Error("Username and password is required");

        if (!user || !user._id) {
          return signUpUser(password, username);
        }

        return signInUser(password, user, user._id.toString());
      },
    }),
  ],
};

export default NextAuth(authOptions);

const signInUser = async (
  password: string,
  user: ThreeWideUser,
  userId: string
): Promise<User> => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Pass don't match");

  return {
    id: userId,
    name: userId,
    email: user.username,
    image: "no image",
  };
};

const signUpUser = async (
  password: string,
  username: string
): Promise<User> => {
  if (!password) throw new Error("Password is required for auth");

  const salt = await bcrypt.genSalt(10);

  const passwordHash = await bcrypt.hash(password, salt);
  //const passwordHash = password;

  const newUser = await UserModel.create({
    username: username,
    password: passwordHash,
  });

  return {
    id: newUser._id as unknown as string,
    name: newUser._id as unknown as string,
    email: "no email",
    image: "no image",
  };
};
