import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arjectProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "SpoofedBotDetected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
