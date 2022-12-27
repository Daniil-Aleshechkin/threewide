import mongoose from "mongoose";

interface StrategyDocument extends mongoose.Document, Strategy {}

export interface Strategy {
  name: string;
}

const StragetySchema = new mongoose.Schema({
  name: String,
});

const StrategyModel: mongoose.Model<StrategyDocument> =
  mongoose.models.Strategy ||
  mongoose.model<StrategyDocument>("Strategy", StragetySchema);

export default StrategyModel;
