import { Request, Response } from "express";
import { authService } from "../../application/auth-service";
import { sendSuccess, sendError } from "../../shared/response";
import { AppError, ErrorCodes } from "../../shared/errors";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email tidak valid").max(255),
  name: z.string().min(1, "Nama wajib diisi").max(255),
  password: z.string().min(8, "Password minimal 8 karakter").max(100),
});

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token wajib diisi"),
});

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        sendError(
          res,
          new AppError(ErrorCodes.VALIDATION_ERROR, "Validasi gagal", 400, parsed.error.flatten().fieldErrors)
        );
        return;
      }
      const tokens = await authService.register(parsed.data);
      sendSuccess(res, tokens, 201, "Registrasi berhasil");
    } catch (e) {
      sendError(res, e);
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        sendError(
          res,
          new AppError(ErrorCodes.VALIDATION_ERROR, "Validasi gagal", 400, parsed.error.flatten().fieldErrors)
        );
        return;
      }
      const tokens = await authService.login(parsed.data);
      sendSuccess(res, tokens, 200, "Login berhasil");
    } catch (e) {
      sendError(res, e);
    }
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const parsed = refreshSchema.safeParse(req.body);
      if (!parsed.success) {
        sendError(
          res,
          new AppError(ErrorCodes.VALIDATION_ERROR, "Validasi gagal", 400, parsed.error.flatten().fieldErrors)
        );
        return;
      }
      const tokens = await authService.refresh(parsed.data.refreshToken);
      sendSuccess(res, tokens, 200, "Token diperbarui");
    } catch (e) {
      sendError(res, e);
    }
  },
};
