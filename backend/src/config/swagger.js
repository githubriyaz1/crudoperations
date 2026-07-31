import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./env.js";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Love2Bazzar API",
      version: "1.0.0",
      description: "Backend API for the Love2Bazzar e-commerce frontend.",
    },
    servers: [{ url: `${env.API_BASE_URL}/api/v1`, description: "API v1" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.js"],
});

export { swaggerUi };
