import type { Settings } from "@components/Settings";
import mongoose from "mongoose";
import type { ObjectId } from "mongoose";

export interface UserDocument
  extends mongoose.Document<ObjectId>,
    ThreeWideUser {}

export interface ThreeWideUser {
  username: string;
  password: string;
  userId: string;
  settings: Settings;
  isAdmin: boolean;
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  settings: {
    keySettings: {
      moveLeft: String,
      moveRight: String,
      holdPiece: String,
      softDrop: String,
      hardDrop: String,
      rotate90: String,
      rotate180: String,
      rotate270: String,
      undo: String,
      reset: String,
      next: String,
      previous: String,
    },
    dasAmount: Number,
  },
  isAdmin: Boolean,
});

const UserModel: mongoose.Model<UserDocument> =
  mongoose.models.user || mongoose.model<UserDocument>("user", userSchema);

export default UserModel;
