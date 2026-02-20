import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../infrastructure/auth/jwt";
import { sendError } from "../../shared/response";
import { AppError, ErrorCodes } from "../../shared/errors";
import type { JwtPayload } from "../../domain/auth";

export interface AuthLocals {
  userId: string;
  email: string;
  payload: JwtPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    sendError(res, new AppError(ErrorCodes.UNAUTHORIZED, "Token tidak ditemukan", 401));
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    (res.locals as unknown as AuthLocals).userId = payload.sub;
    (res.locals as unknown as AuthLocals).email = payload.email;
    (res.locals as unknown as AuthLocals).payload = payload;
    next();
  } catch {
    sendError(res, new AppError(ErrorCodes.UNAUTHORIZED, "Token tidak valid atau kedaluwarsa", 401));
  }
}
