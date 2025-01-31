import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../secrets";
import { UnauthorizedException } from "../exceptions/unautherized";
import { ErrorCode } from "../exceptions/root";

interface payload {
  userId: string
}

export async function authMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return
  }
  try {
    const payload = jwt.verify(token, config.JWT_SECRET_ACCESS_TOKEN) as payload;
    req.user = payload.userId;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
}

