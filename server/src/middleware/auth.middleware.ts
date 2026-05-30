import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import type { UserRole } from "../models/user.model";

/** Ambil token dari header Authorization: Bearer <token> atau cookie `token`. */
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  if (req.cookies?.token) return req.cookies.token as string;
  return null;
}

/** Wajib login: memverifikasi JWT dan mengisi req.user. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(ApiError.unauthorized("Token tidak ditemukan"));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Token tidak valid atau kedaluwarsa"));
  }
}

/** Login opsional: kalau ada token valid diisi, kalau tidak tetap lanjut. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      /* abaikan token invalid */
    }
  }
  next();
}

/** Batasi akses berdasarkan role. */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}
