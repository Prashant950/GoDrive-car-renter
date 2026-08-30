import jwt from "jsonwebtoken";

/**
 * Sign a JWT for a given user id.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "365d",
  });
};

export default generateToken;
