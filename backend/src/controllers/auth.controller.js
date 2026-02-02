import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  const name = typeof fullname === "string" ? fullname.trim() : "";
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const pwd = typeof password === "string" ? password : "";

  try {
    if (!name || !normalizedEmail || !pwd) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (pwd.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    //check if emails valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // 123456 => $#$#*)8dkfj_
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    const newUser = new User({
      fullname: name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        profilePic: newUser.profilePic,
      });

      // todo: send a welcome email to the user
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
