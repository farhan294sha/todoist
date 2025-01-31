import { Request, Response } from "express";
import { prisma } from "../db";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/notFound";
import { UnprocessableEntity } from "../exceptions/validation";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { UnauthorizedException } from "../exceptions/unautherized";
import { InternalException } from "../exceptions/internalException";
import { signupSchema, loginSchema } from "../../../shared/schemas/userSchema";

type User = {
  id: string;
  name: string;
  email: string;
  picture: string | null;
};

export async function signup(req: Request, res: Response) {
  const response = signupSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const { email, password, name } = req.body;

  let user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    throw new BadRequestsException(
      "User already exist",
      ErrorCode.USER_ALREADY_EXIST
    );
  }
  user = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
    },
  });

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id, user.name, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions).json({
    message: "User created successful",
    accessToken,
  });
}

export async function login(req: Request, res: Response) {
  const response = loginSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }

  const { email, password } = req.body;

  let user = await prisma.user.findFirst({
    where: {
      email: email
    },
  });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password!)) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id, user.name, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
  };

  res
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "login successful",
      accessToken,
    });
}

export async function newAccessToken(req: Request, res: Response) {
  const token = req.signedCookies.refreshToken;

  if (!token) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET_REFRESH_TOKEN) as any;

    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        refreshToken: token,
      },
    });
    if (!user) {
      throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }

    const refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user.id, user.name, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      signed: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions).json({
      message: "token created successful",
      accessToken,
    });
  } catch (error) {
    throw new InternalException(
      "Something went wrong",
      error,
      ErrorCode.INTERNAL_ERROR
    );
  }
}

export async function logout(req: Request, res: Response) {
  const userId = req.user;
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
  };

  res
    .clearCookie("refreshToken", cookieOptions)
    .json({ mesaage: "Successfully logout" });
}

export async function googleLogin(req: Request, res: Response) {

  const user: User = req.user as any;

  console.log(user);

  const refreshToken = generateRefreshToken(user.id);
  let accessToken;
  if (user.picture) {
    accessToken = generateAccessToken(
      user.id,
      user.name,
      user.email,
      user.picture
    );
  } else {
    accessToken = generateAccessToken(user.id, user.name, user.email);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.redirect(`http://localhost:5173/today`);
}

export async function me(req: Request, res: Response) {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken,
    },
    select: {
      id: true,
      email: true,
      picture: true,
      name: true
    }
  });

  if (!user) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  res.json(user);
}
