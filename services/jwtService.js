import { ConfigKeys } from "../config.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = ConfigKeys.JWTSECRET;

function generateAccessToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: ConfigKeys.ACCESS_TOKEN_EXPIRES_IN });
}

function generateRefreshToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: ConfigKeys.REFRESH_TOKEN_EXPIRES_IN });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid Access Token");
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid Refresh Token");
  }
}

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
