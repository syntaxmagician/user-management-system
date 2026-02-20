import swaggerJsdoc from "swagger-jsdoc";
import { config } from "../../shared/config";
import path from "path";

const baseDir = process.cwd();
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management System API",
      version: "1.0.0",
      description: "API documentation for User Management System with authentication and user CRUD operations",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "00000000-0000-0000-0000-000000000001",
            },
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            name: {
              type: "string",
              example: "Admin User",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        AuthTokens: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            expiresIn: {
              type: "number",
              example: 900,
              description: "Token expiration time in seconds",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "name", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "John Doe",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 100,
              example: "password123",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["email", "name", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "newuser@example.com",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "New User",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 100,
              example: "password123",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "updated@example.com",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "Updated Name",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 100,
              example: "newpassword123",
            },
          },
        },
        ApiSuccess: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
        ApiListSuccess: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
            meta: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  example: 1,
                },
                limit: {
                  type: "number",
                  example: 10,
                },
                total: {
                  type: "number",
                  example: 100,
                },
                totalPages: {
                  type: "number",
                  example: 10,
                },
              },
            },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },
                message: {
                  type: "string",
                  example: "Validation failed",
                },
                details: {
                  type: "object",
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Health",
        description: "Health check endpoint",
      },
    ],
  },
  apis: [
    path.join(baseDir, "src", "delivery", "routes", "*.ts"),
    path.join(baseDir, "src", "delivery", "app.ts"),
    path.join(baseDir, "dist", "delivery", "routes", "*.js"),
    path.join(baseDir, "dist", "delivery", "app.js"),
  ],
};

let swaggerSpec: ReturnType<typeof swaggerJsdoc>;

try {
  swaggerSpec = swaggerJsdoc(options);
  console.log("[Swagger] Documentation loaded successfully");
} catch (error) {
  console.warn("[Swagger] Failed to generate spec from JSDoc:", error);
  console.warn("[Swagger] Using basic spec without route documentation");
  // Fallback: return basic spec without JSDoc parsing
  swaggerSpec = options.definition as any;
}

export { swaggerSpec };
