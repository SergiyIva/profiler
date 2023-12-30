import mongoose, { ClientSession } from "mongoose";
import Logger from "./logger.js";

type TransactionCallback = (session: ClientSession) => Promise<void>;

export const runInTransaction = async (callback: TransactionCallback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await callback(session);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    Logger.error(err);
    throw err;
  } finally {
    await session.endSession();
  }
};
