import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../models/user.model";

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;
}
