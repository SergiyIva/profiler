import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import Logger from "./lib/logger.js";
import db from "./db.js";
import router from "./routes/index.js";
import handlers from "./middlewares/handlers.js";
import { setAuthContext } from "./middlewares/auth.js";
import helmet from "helmet";

const host = process.env.HOST;
const port = process.env.PORT || 4000;
const dbHost = process.env.DB_HOST;
const cookiesSecret = process.env.COOKIES_SECRET;

const app = express();
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'", "'unsafe-inline'", "blob:", "*"],
        "script-src": ["'self'", "'unsafe-inline'", "blob:", "*"],
        // "connect-src": ["'self'", "blob:"],
      },
    },
    crossOriginOpenerPolicy: false,
  }),
);
app.use(compression());
await db.connect(dbHost);

process.on("uncaughtException", async (err) => {
  Logger.error("НЕПЕРЕХВАЧЕННОЕ ИСКЛЮЧЕНИЕ\n", err.stack);
  await db.close();
  process.exit(1);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookiesSecret));
app.use(morganMiddleware);
app.use(express.static("./public"));
app.use(setAuthContext);

app.use("/api", router);
app.get("/*", handlers.getApp);
app.use(handlers.handleError);
app.listen(port, () => {
  Logger.info(`🚀 Server ready at http://${host}:${port}/api`);
});
