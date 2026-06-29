import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Privacy-Preserving Verification Platform API",
      version: "1.0.0",
      description:
        "API documentation for the MSc Privacy-Preserving Verification Platform for Public Services.",
    },
    servers: [
      {
        url: "http://localhost:7000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Verification Requests" },
      { name: "Consents" },
      { name: "Verifications" },
      { name: "Audit Logs" },
      { name: "Dashboard" },
      { name: "Admin" },
      { name: "Health" },
    ],
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
  apis: ["./src/modules/**/*.routes.ts"],
});