import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ENV } from "../lib/env.js";

const router = express.Router();

router.use(
  ENV.NODE_ENV === "development"
    ? (req, res, next) => next()
    : arcjetProtection,
);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.get("/protected", protectRoute, (_, res) => {
  res.status(200).json({ message: "You have accessed a protected route." });
});

export default router;
