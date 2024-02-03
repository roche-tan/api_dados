import { connect } from "mongoose";
import config from "../config";

export const connectDB = async () => {
  try {
    await connect(config.mongoDB as string);
    console.log("MongoDB Connected 🚀");
  } catch (error) {
    console.log(error);
  }
};
