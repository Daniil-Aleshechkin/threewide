import NextAuth from "next-auth";
import type { User, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import UserModel from "src/models/user.model";
import type { ThreeWideUser, UserDocument } from "src/models/user.model";
import connectMongo from "@utils/mongoose";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token, user }) {
      //Can't figure out how to change the types of the call back in next auth so I have this hack for now
      //@ts-ignore next-line
      session.isAdmin = token.isAdmin ?? false;

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        const admins = process.env.ADMIN_ACCOUNTS?.split(",");

        if (!admins) return token;
        if (
          user.email &&
          admins.filter(
            (admin) => admin.toLowerCase() == user.email?.toLowerCase()
          ).length == 1
        ) {
          token.isAdmin = true;
          console.log("TOKEN AFTER CREATION", token);
        }
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
