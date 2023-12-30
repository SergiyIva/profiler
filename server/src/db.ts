import mongoose from "mongoose";
import Logger from "./lib/logger.js";
import "dotenv/config";

const db = {
  connect: async (DB_HOST: string) => {
    await mongoose.connect(DB_HOST);
    mongoose.connection.on("error", (err) => {
      Logger.warn("MongoDB connection error. Давай, запусти Монго, ЭЙ!");
      Logger.error(err);
      process.exit();
    });
    if (process.env.NODE_ENV !== "production") mongoose.set("debug", true);
  },
  close: async () => {
    await mongoose.connection.close();
  },
};
export default db;
