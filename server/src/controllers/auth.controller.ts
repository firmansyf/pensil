import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";
import type { RegisterInput, LoginInput } from "../validators";

const COOKIE_NAME = "token";
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as RegisterInput;

  const exists = await User.findOne({ where: { email } });
  if (exists) throw ApiError.conflict("Email sudah terdaftar");

  const user = await User.create({ name, email, password, role: "reader" });
  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(201).json({ success: true, data: { user: user.toSafeJSON(), token } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Email atau password salah");
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ success: true, data: { user: user.toSafeJSON(), token } });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.sub);
  if (!user) throw ApiError.notFound("User tidak ditemukan");
  res.json({ success: true, data: user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true, message: "Berhasil logout" });
});
