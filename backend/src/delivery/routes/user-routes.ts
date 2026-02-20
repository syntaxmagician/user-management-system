import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { userController } from "../controllers/user-controller";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/", (req, res) => userController.list(req, res));
userRoutes.get("/:id", (req, res) => userController.getById(req, res));
userRoutes.post("/", (req, res) => userController.create(req, res));
userRoutes.put("/:id", (req, res) => userController.update(req, res));
userRoutes.delete("/:id", (req, res) => userController.delete(req, res));
