import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Membungkus async handler agar error otomatis diteruskan ke error middleware.
 * (Express 5 sudah menangani promise rejection, tapi ini eksplisit & aman.)
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
