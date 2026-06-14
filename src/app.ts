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

const app = express();

// I use helmet to add helpful security headers.
app.use(helmet());

// I allow JSON request bodies so clients can send data to the API.
app.use(express.json());

// I enable CORS so the frontend can communicate with this backend later.
app.use(cors());

// I use morgan to see API requests in the terminal during development.
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Privacy Verification Platform API is running",
  });
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