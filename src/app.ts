import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import authTestRoutes from "./modules/auth/auth.testRoutes";
import verificationRequestRoutes from "./modules/verificationRequests/verificationRequest.routes";
import consentRoutes from "./modules/consents/consent.routes";
import verificationRoutes from "./modules/verifications/verification.routes";
import auditLogRoutes from "./modules/auditLogs/auditLog.routes";
import adminRoutes from "./modules/admin/admin.routes";
import healthRoutes from "./modules/health/health.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

// I use helmet to add helpful security headers.
// This strengthens the backend against common browser-facing security issues
// and helps reduce security-header warnings during OWASP ZAP evaluation.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: {
      policy: "same-origin",
    },
  })
);

// I allow JSON request bodies so clients can send data to the API.
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

// I restrict CORS to the known frontend development origins.
// This avoids exposing the API to every external origin while still allowing
// the frontend, Postman, ZAP, and server-to-server requests to work locally.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// I use morgan to see API requests in the terminal during development.
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Privacy Verification Platform API is running",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/openapi.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Auth routes
app.use("/api/auth", authRoutes);

// I keep these temporary test routes to prove authentication and RBAC work.
// Later, i am gonna remove them or keep them only for development.
app.use("/api/auth/test", authTestRoutes);
app.use("/api/verification-requests", verificationRequestRoutes);
app.use("/api/consents", consentRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/dashboard", dashboardRoutes)

// I keep this after all routes so it catches errors from the whole app.
app.use(errorHandler);

export default app;