import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = process.env;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    secure: NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attacks: cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
