import { Request, Response } from "express";
import { userService } from "../../application/user-service";
import { sendSuccess, sendListSuccess, sendError } from "../../shared/response";
import { AppError, ErrorCodes } from "../../shared/errors";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Email tidak valid").max(255),
  name: z.string().min(1, "Nama wajib diisi").max(255),
  password: z.string().min(8, "Password minimal 8 karakter").max(100),
});

const updateUserSchema = z.object({
  email: z.string().email("Email tidak valid").max(255).optional(),
  name: z.string().min(1).max(255).optional(),
  password: z.string().min(8).max(100).optional(),
});

export const userController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await userService.list({ page, limit, search });
      sendListSuccess(res, result.users, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (e) {
      sendError(res, e);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      if (!user) {
        sendError(res, new AppError(ErrorCodes.NOT_FOUND, "User tidak ditemukan", 404));
        return;
      }
      sendSuccess(res, user);
    } catch (e) {
      sendError(res, e);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        sendError(
          res,
          new AppError(ErrorCodes.VALIDATION_ERROR, "Validasi gagal", 400, parsed.error.flatten().fieldErrors)
        );
        return;
      }
      const user = await userService.create(parsed.data);
      sendSuccess(res, user, 201, "User berhasil dibuat");
    } catch (e) {
      sendError(res, e);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        sendError(
          res,
          new AppError(ErrorCodes.VALIDATION_ERROR, "Validasi gagal", 400, parsed.error.flatten().fieldErrors)
        );
        return;
      }
      const user = await userService.update(id, parsed.data);
      if (!user) {
        sendError(res, new AppError(ErrorCodes.NOT_FOUND, "User tidak ditemukan", 404));
        return;
      }
      sendSuccess(res, user, 200, "User berhasil diupdate");
    } catch (e) {
      sendError(res, e);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await userService.delete(id);
      if (!deleted) {
        sendError(res, new AppError(ErrorCodes.NOT_FOUND, "User tidak ditemukan", 404));
        return;
      }
      sendSuccess(res, { id }, 200, "User berhasil dihapus");
    } catch (e) {
      sendError(res, e);
    }
  },
};
