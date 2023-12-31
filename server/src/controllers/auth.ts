import { Request, Response } from "express";
import models from "../models/index.js";
import { AUTH_ERROR, REGISTER_ERROR, USER_EXIST } from "../constants/errors.js";
import bcrypt from "bcrypt";
import { authTokens } from "../middlewares/auth.js";
import { TOKEN_PATH } from "../lib/tokensFuncs.js";
import { validateAuth } from "../validators/auth.js";
import { validateUser } from "../validators/user.js";
import Logger from "../lib/logger.js";
import path from "node:path";
import fs from "fs";
import { runInTransaction } from "../lib/runInTransaction.js";
import { __dirname } from "../varCJS.js";
import { OK } from "../constants/responses.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!validateAuth(res, { email, password })) return;
  const trimedEmail = email.trim().toLowerCase();
  const user = await models.User.findOne({
    email: trimedEmail,
  });
  if (!user) return res.status(401).send(AUTH_ERROR);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).send(AUTH_ERROR);
  }
  await authTokens(user, res);
  res.status(200).send(user);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access", { path: TOKEN_PATH });
  res.clearCookie("refresh", { path: TOKEN_PATH });
  res.status(200).send({ message: OK });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, username, birthday, gender } = req.body;
  if (!validateUser(res, { email, password, username, birthday, gender }))
    return;
  const trimedEmail = email.trim().toLowerCase();
  const hashed = await bcrypt.hash(password, 10);
  let filepath;
  try {
    let user;
    await runInTransaction(async (session) => {
      const userArr = await models.User.create(
        [
          {
            email: trimedEmail,
            password: hashed,
            username,
            birthday,
            gender,
          },
        ],
        {
          session,
        },
      );
      user = userArr[0];
      if (req.file) {
        filepath = "images/" + user._id + path.extname(req.file.originalname);
        fs.writeFile("public/" + filepath, req.file.buffer, (err) => {
          if (err) throw new Error();
        });
        await models.Photo.create(
          [
            {
              user: user._id,
              media: filepath,
            },
          ],
          { session },
        );
      }
    });
    await authTokens(user, res);
    res.status(200).send({
      username: user.username,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      avatar: filepath,
    });
  } catch (err) {
    const fullPath = __dirname + "/../public/" + filepath;
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) Logger.error("Ошибка при попытке удаления файла", err);
      });
    }
    Logger.error(REGISTER_ERROR, err);
    if (err.code === 11000 && err.keyValue.username)
      return res.status(400).send(USER_EXIST);
    res.status(400).send(REGISTER_ERROR);
  }
};
