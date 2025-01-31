import jwt from "jsonwebtoken";
import { config } from "../secrets";

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId: userId }, config.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "10d",
  });
}

export function generateAccessToken(
  userId: string,
  name: string,
  email: string,
  picture: string | null = null
) {
  return jwt.sign(
    { userId, name, email, picture },
    config.JWT_SECRET_ACCESS_TOKEN,
    { expiresIn: "15m" }
  );
}
