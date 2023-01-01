import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connections[0]?.readyState ?? false) return;

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please set mongo uri in the environment variable MONGODB_URI"
    );
  }
  mongoose.connect(process.env.MONGODB_URI);
};

export default connectMongo;
