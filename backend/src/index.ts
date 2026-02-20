import app from "./delivery/app";
import { config } from "./shared/config";

const server = app.listen(config.port, () => {
  console.log(`[Server] listening on port ${config.port} (${config.nodeEnv})`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
