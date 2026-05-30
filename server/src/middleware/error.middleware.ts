import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from "sequelize";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/** 404 untuk route yang tidak terdaftar. */
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} tidak ditemukan`));
}

/** Error handler terpusat. Harus memiliki 4 argumen agar dikenali Express. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Terjadi kesalahan pada server";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validasi gagal";
    details = err.flatten().fieldErrors;
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = "Data sudah ada (duplikat)";
    details = err.errors.map((e) => e.message);
  } else if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    message = "Validasi database gagal";
    details = err.errors.map((e) => e.message);
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.NODE_ENV === "development" && err instanceof Error ? { stack: err.stack } : {}),
  });
}
