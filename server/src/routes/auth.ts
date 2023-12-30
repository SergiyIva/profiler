import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { upload } from "../lib/upload.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", upload.single("avatar"), register);
export default router;
