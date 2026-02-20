import { Request, Response, NextFunction } from "express";
import { sendError } from "../../shared/response";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  sendError(res, err);
}
