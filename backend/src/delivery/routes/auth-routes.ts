import { Router } from "express";
import { authController } from "../controllers/auth-controller";

export const authRoutes = Router();

authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.post("/refresh", (req, res) => authController.refresh(req, res));
