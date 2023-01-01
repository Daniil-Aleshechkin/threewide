import GameDescriptionModel, { Game } from "src/models/game_description.model";
import { z } from "zod";
import StrategyModel from "../../../models/stategy.model";
import connectMongo from "../../../utils/mongoose";
import { Types } from "mongoose";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import UserGameResultModel, {
  UserGameResult,
  UserGameResultDocument,
} from "src/models/user_game_result.model";

export interface UserGame extends Game, UserGameResult {
  isAttempted: boolean;
}

export const gameDescriptionRouter = router({
  getGames: publicProcedure
    .input(z.object({ name: z.string(), userId: z.string().nullable() }))
    .query(async ({ input }) => {
      try {
        if (!input.userId) return { error: "User not logged in" };

        await connectMongo();

        const strategy = await StrategyModel.findOne({
          name: {
            $eq: input.name,
          },
        });

        const games = await GameDescriptionModel.find({
          strategy: {
            $eq: strategy?._id,
          },
        });

        const userGames: Promise<UserGame>[] = games.map(async (game) => {
          const userGameResult: UserGameResultDocument | null =
            await UserGameResultModel.findOne({
              userId: {
                $eq: new Types.ObjectId(input.userId ?? ""),
              },
              gameId: {
                $eq: game._id,
              },
            });

          return {
            startingBoardState: game.startingBoardState,
            startingPieceQueue: game.startingPieceQueue,
            goal: game.goal,
            isCompleted: userGameResult?.isCompleted ?? false,
            isAttempted: userGameResult !== null,
            gameId: game._id.toString(),
            name: game.name,
          };
        });

        return { games: await Promise.all(userGames) };
      } catch (err) {
        console.log(err);
        return { error: err };
      }
    }),
});
