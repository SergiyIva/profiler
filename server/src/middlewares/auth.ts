import models from "../models/index.js";
import { NextFunction, Request, Response } from "express";
import Logger from "../lib/logger.js";
import {
  setTokens,
  TOKEN_PATH,
  tokenCookies,
  validateAccessToken,
  validateRefreshToken,
} from "../lib/tokensFuncs.js";

export type UserPayload = {
  id: string;
};
export const authTokens = async (user: any, res: Response) => {
  const tokens = setTokens(user);
  const cookies = tokenCookies(tokens);
  await user.updateOne({ $inc: { tokenCount: 1 } });
  res.cookie(...cookies.access);
  res.cookie(...cookies.refresh);
};

export const setAuthContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies["refresh"];
  const accessToken = req.cookies["access"];

  let user;
  if (accessToken || refreshToken) {
    const decodedAccessToken = validateAccessToken(accessToken);
    // если access действителен, то просто ставим user и идем дальше
    if (decodedAccessToken && decodedAccessToken.user) {
      user = decodedAccessToken.user;
    }
    // если access не действителен, либо обновляем токен, либо ОБЯЗАТЕЛЬНО удаляем куки
    if (!user) {
      const decodedRefreshToken = validateRefreshToken(refreshToken);
      // если валиден refresh, то проверяем user, иначе удаляем куки
      if (decodedRefreshToken && decodedRefreshToken.user) {
        const userDB = await models.User.findById(decodedRefreshToken.user.id);
        // проверяем на актуальность пользователя и порядкового номера токена в базе,
        // также делаем проверку пользовательского агента, если все ок, то обновляем токены
        // и ставим новые куки, если нет, то удаляем куки
        if (userDB && userDB.tokenCount === decodedRefreshToken.user.count) {
          user = decodedRefreshToken.user;
          await authTokens(userDB, res);
        } else {
          res.clearCookie("access", { path: TOKEN_PATH });
          res.clearCookie("refresh", { path: TOKEN_PATH });
        }
      } else {
        res.clearCookie("access", { path: TOKEN_PATH });
        res.clearCookie("refresh", { path: TOKEN_PATH });
      }
    }
  }

  Logger.info(user, req.path);
  if (user) req.user = user;
  next();
};
