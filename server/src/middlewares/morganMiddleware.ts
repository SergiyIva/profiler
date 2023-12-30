import morgan, { StreamOptions } from "morgan";
import Logger from "../lib/logger.js";

const stream: StreamOptions = {
  write: (message) =>
    Logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

const skip = (req) => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development" || req.url.startsWith("/public");
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);

export default morganMiddleware;
