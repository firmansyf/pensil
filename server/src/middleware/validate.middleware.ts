import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

type Source = "body" | "query" | "params";

/** Validasi & parse bagian request memakai schema Zod. */
export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    // Di Express 5 `req.query` & `req.params` adalah getter read-only,
    // jadi pakai defineProperty untuk menimpa dengan hasil parse (ter-coerce).
    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
}
