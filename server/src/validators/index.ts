import { Response } from "express";
import Logger from "../lib/logger.js";
import { DATA_INCORRECT } from "../constants/errors.js";
export const validator = <T extends {}>(fn: (args: T) => boolean) => {
  return (res: Response, args: T) => {
    if (!fn(args)) {
      Logger.error(DATA_INCORRECT);
      res.status(400).send(DATA_INCORRECT);
      return false;
    } else return true;
  };
};
