import express from "express";
import {
  changePassword,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/users.js";
import { upload } from "../lib/upload.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getUser);
router.post("/me", upload.single("avatar"), updateUser);
router.post("/password", changePassword);

export default router;
