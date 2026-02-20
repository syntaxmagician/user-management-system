import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
