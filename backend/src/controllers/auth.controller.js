import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

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
        wfilePic: newUser.profilePic,
      });

      try {
        const clientUrl = ENV.CLIENT_URL || "http://localhost:5173";
        await sendWelcomeEmail(savedUser.email, savedUser.fullname, clientUrl);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const pwd = typeof password === "string" ? password : "";

  try {
    if (!normalizedEmail || !pwd) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    } // never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(pwd, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const logout = (_, res) => {
  res.cookie("token", "", {
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully." });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const pic = typeof profilePic === "string" ? profilePic.trim() : "";
    if (!pic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(pic, {
      public_id: `profile_pics/${userId}`,
      overwrite: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
