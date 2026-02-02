import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arjectProtection } from "../middleware/arject.middleware.js";

const router = express.Router();

router.use(arjectProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.post("/update-profile", protectRoute, updateProfile);

router.get("/protected", protectRoute, (_, res) => {
  res.status(200).json({ message: "You have accessed a protected route." });
});

export default router;
