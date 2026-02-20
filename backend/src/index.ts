import app from "./delivery/app";
import { config } from "./shared/config";

// Listen on all network interfaces (0.0.0.0) to allow access from emulators and devices
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`[Server] listening on port ${config.port} (${config.nodeEnv})`);
  console.log(`[Server] Accessible at http://localhost:${config.port} and http://0.0.0.0:${config.port}`);
  console.log(`[Server] Landing page: http://localhost:${config.port}/`);
  console.log(`[Server] Swagger docs: http://localhost:${config.port}/api-docs`);
  console.log(`[Server] Health check: http://localhost:${config.port}/health`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
