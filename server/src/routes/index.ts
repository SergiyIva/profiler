import express from "express";
import users from "./users.js";
import auth from "./auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("API for Profiler App!");
});
router.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "Okay!",
    message: "Welcome to Profiler platform!",
  });
});
router.use("/users", users);
router.use("/auth", auth);

export default router;
