import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { loggerMiddleware } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";

const app = express();

console.log("[App] Initializing Express app...");

// Simple test route - registered FIRST
app.get("/ping", (_req, res) => {
  console.log("[Route] GET /ping - Request received");
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});
console.log("[App] Route GET /ping registered");

// Landing page - MUST be registered FIRST, before any middleware
app.get("/", (req, res) => {
  console.log(`[Route] GET / - Request received from ${req.ip} at ${new Date().toISOString()}`);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Management System API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 800px;
          width: 100%;
          padding: 48px;
          text-align: center;
        }
        h1 {
          color: #1a202c;
          font-size: 2.5rem;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .subtitle {
          color: #4a5568;
          font-size: 1.25rem;
          margin-bottom: 32px;
        }
        .info {
          background: #f7fafc;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          text-align: left;
        }
        .info h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 16px;
        }
        .info p {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .links {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .link {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }
        .link-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }
        .link-secondary:hover {
          background: #f7fafc;
        }
        .endpoints {
          margin-top: 24px;
          text-align: left;
        }
        .endpoint {
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .endpoint:last-child {
          border-bottom: none;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-right: 8px;
          min-width: 60px;
          text-align: center;
        }
        .method.get { background: #c6f6d5; color: #22543d; }
        .method.post { background: #bee3f8; color: #2c5282; }
        .method.put { background: #faf089; color: #744210; }
        .method.delete { background: #fed7d7; color: #742a2a; }
        code {
          background: #edf2f7;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 User Management System API</h1>
        <p class="subtitle">RESTful API untuk manajemen user dengan autentikasi JWT</p>
        
        <div class="info">
          <h2>📚 Dokumentasi API</h2>
          <p>
            Akses dokumentasi interaktif lengkap dengan Swagger UI untuk melihat semua endpoint, 
            request/response examples, dan test API langsung dari browser.
          </p>
          <div class="links">
            <a href="/api-docs" class="link">📖 Buka Swagger Documentation</a>
            <a href="/health" class="link link-secondary">🏥 Health Check</a>
          </div>
        </div>

        <div class="info">
          <h2>🔗 Quick Links</h2>
          <div class="endpoints">
            <div class="endpoint">
              <span class="method post">POST</span>
              <code>/api/v1/auth/register</code> - Registrasi user baru
            </div>
            <div class="endpoint">
              <span class="method post">POST</span>
              <code>/api/v1/auth/login</code> - Login dan dapatkan token
            </div>
            <div class="endpoint">
              <span class="method get">GET</span>
              <code>/api/v1/users</code> - List semua user (perlu auth)
            </div>
            <div class="endpoint">
              <span class="method post">POST</span>
              <code>/api/v1/users</code> - Buat user baru (perlu auth)
            </div>
            <div class="endpoint">
              <span class="method put">PUT</span>
              <code>/api/v1/users/:id</code> - Update user (perlu auth)
            </div>
            <div class="endpoint">
              <span class="method delete">DELETE</span>
              <code>/api/v1/users/:id</code> - Hapus user (perlu auth)
            </div>
          </div>
        </div>

        <div class="info">
          <h2>🔐 Authentication</h2>
          <p>
            Semua endpoint user management memerlukan JWT token. 
            Dapatkan token dengan login di <code>/api/v1/auth/login</code>, 
            kemudian gunakan header <code>Authorization: Bearer &lt;token&gt;</code>
          </p>
        </div>

        <div class="info">
          <h2>📝 Response Format</h2>
          <p>
            Semua response mengikuti format standar dengan field <code>success</code>, 
            <code>data</code>, dan <code>error</code>. Lihat dokumentasi lengkap di Swagger UI.
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(loggerMiddleware);

// Test route to verify Express is working
app.get("/test", (_req, res) => {
  res.json({ message: "Express is working!" });
});

// Import swagger spec with error handling
let swaggerSpec: any;
try {
  // Use dynamic import to avoid blocking app startup
  const swaggerModule = require("../infrastructure/swagger/swagger");
  swaggerSpec = swaggerModule.swaggerSpec;
  if (!swaggerSpec) {
    throw new Error("Swagger spec is undefined");
  }
  console.log("[Swagger] Swagger spec loaded successfully");
} catch (error: any) {
  console.error("[Swagger] Failed to load swagger spec:", error?.message || error);
  console.error("[Swagger] Error stack:", error?.stack);
  // Create minimal fallback spec
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "User Management System API",
      version: "1.0.0",
      description: "API documentation for User Management System",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    paths: {},
  };
  console.log("[Swagger] Using fallback swagger spec");
}

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "User Management System API Documentation",
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// 404 handler for undefined routes (must be before error handler)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Endpoint tidak ditemukan",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

console.log("[App] Routes registered:");
console.log("[App]   GET  /");
console.log("[App]   GET  /api-docs");
console.log("[App]   GET  /health");
console.log("[App]   POST /api/v1/auth/register");
console.log("[App]   POST /api/v1/auth/login");
console.log("[App]   POST /api/v1/auth/refresh");
console.log("[App]   GET  /api/v1/users");
console.log("[App]   POST /api/v1/users");
console.log("[App]   GET  /api/v1/users/:id");
console.log("[App]   PUT  /api/v1/users/:id");
console.log("[App]   DELETE /api/v1/users/:id");

export default app;
