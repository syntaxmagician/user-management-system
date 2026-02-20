import { Response } from "express";
import { AppError } from "./errors";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiListSuccess<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  res.status(statusCode).json(body);
}

export function sendListSuccess<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number },
  statusCode = 200
): void {
  const body: ApiListSuccess<T> = { success: true, data, meta };
  res.status(statusCode).json(body);
}

export function sendError(res: Response, err: unknown): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message,
      details: undefined,
    },
  });
}
