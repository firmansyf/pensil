import type { JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      /** Diisi oleh authenticate middleware setelah verifikasi JWT. */
      user?: JwtPayload;
    }
  }
}

export {};
