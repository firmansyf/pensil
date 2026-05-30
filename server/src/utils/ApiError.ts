export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(msg = "Bad request", details?: unknown) {
    return new ApiError(400, msg, details);
  }
  static unauthorized(msg = "Tidak terautentikasi") {
    return new ApiError(401, msg);
  }
  static forbidden(msg = "Akses ditolak") {
    return new ApiError(403, msg);
  }
  static notFound(msg = "Data tidak ditemukan") {
    return new ApiError(404, msg);
  }
  static conflict(msg = "Data sudah ada") {
    return new ApiError(409, msg);
  }
}
