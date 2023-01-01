import type { Settings } from "@components/Settings";
import { Types } from "mongoose";
import UserModel from "src/models/user.model";
import { z } from "zod";
import connectMongo from "../../../utils/mongoose";
import { router, publicProcedure } from "../trpc";

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

export const userRouter = router({
  getUserSettings: publicProcedure
    .input(
      z.object({
        userId: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      try {
        if (!input.userId) return;

        await connectMongo();

        const user = await UserModel.findOne({
          _id: { $eq: new Types.ObjectId(input.userId) },
        });

        if (!user) {
          return { error: "User not found" };
        }

        if (!user.settings.dasAmount) {
          return {
            settings: defaultUserSettings,
          };
        }

        return {
          settings: user.settings,
        };
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    }),
  saveUserSettings: publicProcedure
    .input(
      z.object({
        userId: z.string().nullish(),
        settings: z.object({
          keySettings: z.object({
            moveLeft: z.string(),
            moveRight: z.string(),
            holdPiece: z.string(),
            hardDrop: z.string(),
            softDrop: z.string(),
            rotate90: z.string(),
            rotate180: z.string(),
            rotate270: z.string(),
            reset: z.string(),
            next: z.string(),
            previous: z.string(),
          }),
          dasAmount: z.number(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        if (!input.userId) return;
        await connectMongo();

        await UserModel.updateOne(
          {
            _id: { $eq: new Types.ObjectId(input.userId) },
          },
          {
            $set: {
              settings: input.settings,
            },
          }
        );
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    }),
});
