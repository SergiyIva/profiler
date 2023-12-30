import { Request, Response } from "express";
import models from "../models/index.js";
import {
  NO_AUTH,
  NO_UPDATE,
  PASS_EQUAL,
  PASS_INCORRECT,
} from "../constants/errors.js";
import {
  validatePasswordUpdate,
  validateUserUpdate,
} from "../validators/user.js";
import bcrypt from "bcrypt";
import Logger from "../lib/logger.js";
import path from "node:path";
import * as fs from "fs";
import { runInTransaction } from "../lib/runInTransaction.js";
import mongoose from "mongoose";
import { __dirname } from "../varCJS.js";
import { OK } from "../constants/responses.js";

const LIMIT_FEED = 20;

export const getUsers = async (req: Request, res: Response) => {
  const { page } = req.query;
  const userId =
    !!req.user && req.user.id
      ? new mongoose.Types.ObjectId(req.user.id)
      : undefined;
  let skip = !!page && Number(page) > 0 ? Number(page) - 1 : 0;
  const users = await models.User.aggregate([
    { $match: { _id: { $ne: userId } } },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $skip: skip * LIMIT_FEED,
    },
    {
      $limit: LIMIT_FEED,
    },
    {
      $lookup: {
        from: "photos",
        localField: "_id",
        foreignField: "user",
        as: "avatarDoc",
      },
    },
    {
      $unwind: {
        path: "$avatarDoc",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        username: 1,
        birthday: 1,
        avatar: "$avatarDoc.media",
      },
    },
  ]);
  const total = await models.User.countDocuments({});
  res.status(200).send({
    total: userId ? total - 1 : total,
    users,
  });
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).send(NO_AUTH);
  }
  const user = await models.User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "photos",
        localField: "_id",
        foreignField: "user",
        as: "avatarDoc",
      },
    },
    {
      $unwind: "$avatarDoc",
    },
    {
      $project: {
        username: 1,
        birthday: 1,
        email: 1,
        gender: 1,
        avatar: "$avatarDoc.media",
      },
    },
  ]);
  res.status(200).send(user[0]);
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).send(NO_AUTH);
  }
  const { username } = req.body;
  if (!validateUserUpdate(res, { username })) return;
  try {
    let user;
    await runInTransaction(async (session) => {
      let avatar;
      if (req.file) {
        const filepath =
          "images/" + userId + path.extname(req.file.originalname);
        fs.writeFile("public/" + filepath, req.file.buffer, (err) => {
          if (err) throw err;
        });
        const currentAvatar = await models.Photo.findOne({ user: userId });
        if (
          !!currentAvatar &&
          path.extname(req.file.originalname) !==
            path.extname(currentAvatar.media)
        ) {
          const fullPath = __dirname + "/../public/" + currentAvatar.media;
          fs.unlinkSync(fullPath);
        }
        if (!!currentAvatar)
          await currentAvatar.updateOne(
            {
              media: filepath,
            },
            {
              upsert: true,
              session,
            },
          );
        else
          await models.Photo.create({
            user: userId,
            media: filepath,
          });
        avatar = filepath;
      }
      user = await models.User.findByIdAndUpdate(
        userId,
        {
          $set: { username },
        },
        {
          session,
          new: true,
          projection: {
            username: 1,
            email: 1,
            birthday: 1,
            gender: 1,
            avatar,
          },
        },
      );
    });
    res.status(200).send(user);
  } catch (err) {
    Logger.error(NO_UPDATE, err);
    res.status(500).send(NO_UPDATE);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).send(NO_AUTH);
  }
  const { password, newPassword } = req.body;
  if (!validatePasswordUpdate(res, { password, newPassword })) return;
  if (newPassword === password) {
    return res.status(400).send(PASS_EQUAL);
  }
  const user = await models.User.findById(userId);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).send(PASS_INCORRECT);
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  try {
    await user.updateOne({
      $set: {
        password: hashed,
      },
    });
    res.status(200).send({ message: OK });
  } catch (err) {
    Logger.error(NO_UPDATE, err);
    res.status(500).send(NO_UPDATE);
  }
};
