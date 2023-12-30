import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import Logger from "./logger.js";
import { CookieOptions } from "express";

type TokenCookies = (args: { accessToken: string; refreshToken: string }) => {
  access: [string, string, CookieOptions];
  refresh: [string, string, CookieOptions];
};

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_SECRET_REFRESH;
const SEVEN_DAYS = 60 * 60 * 24 * 7 * 1000;
const FIFTEEN_MINS = 60 * 15 * 1000;
export const TOKEN_PATH = "/api";

export function setTokens(user) {
  const accessUser = {
    id: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign({ user: accessUser }, accessSecret, {
    expiresIn: FIFTEEN_MINS,
  });
  const refreshUser = {
    id: user.id,
    role: user.role,
    count: user.tokenCount + 1,
  };
  const refreshToken = jwt.sign({ user: refreshUser }, refreshSecret, {
    expiresIn: SEVEN_DAYS,
  });

  return { accessToken, refreshToken };
}

export function validateAccessToken(token: string) {
  try {
    return jwt.verify(token, accessSecret) as JwtPayload;
  } catch {
    Logger.warn("Недействительный токен");
    return null;
  }
}

export function validateRefreshToken(token: string) {
  try {
    return jwt.verify(token, refreshSecret) as JwtPayload;
  } catch {
    Logger.warn("Недействительный токен");
    return null;
  }
}

export const tokenCookies: TokenCookies = ({ accessToken, refreshToken }) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: TOKEN_PATH,
    expires: new Date(Date.now() + SEVEN_DAYS),
  };
  return {
    access: ["access", accessToken, cookieOptions],
    refresh: ["refresh", refreshToken, cookieOptions],
  };
};
