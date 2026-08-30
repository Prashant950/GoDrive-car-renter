import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect routes — requires a valid Bearer token.
 * Attaches req.user (without password).
 */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is disabled. Contact support." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
