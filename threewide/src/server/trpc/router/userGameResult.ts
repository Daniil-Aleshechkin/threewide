import { Types } from "mongoose";
import UserGameResultModel from "src/models/user_game_result.model";
import { z } from "zod";
import connectMongo from "../../../utils/mongoose";
import { router, publicProcedure } from "../trpc";

export const userGameResultRouter = router({
  createUserGameResult: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        gameId: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await connectMongo();

        await UserGameResultModel.updateOne(
          {
            userId: {
              $eq: new Types.ObjectId(input.userId),
            },
            gameId: {
              $eq: new Types.ObjectId(input.gameId),
            },
          },
          {
            $set: {
              isCompleted: input.isCompleted,
            },
          },
          {
            upsert: true,
          }
        );
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    }),
});
