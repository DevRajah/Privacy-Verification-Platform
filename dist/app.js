"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_testRoutes_1 = __importDefault(require("./modules/auth/auth.testRoutes"));
const verificationRequest_routes_1 = __importDefault(require("./modules/verificationRequests/verificationRequest.routes"));
const consent_routes_1 = __importDefault(require("./modules/consents/consent.routes"));
const verification_routes_1 = __importDefault(require("./modules/verifications/verification.routes"));
const auditLog_routes_1 = __importDefault(require("./modules/auditLogs/auditLog.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const app = (0, express_1.default)();
// I use helmet to add helpful security headers.
app.use((0, helmet_1.default)());
// I allow JSON request bodies so clients can send data to the API.
app.use(express_1.default.json());
// I enable CORS so the frontend can communicate with this backend later.
app.use((0, cors_1.default)());
// I use morgan to see API requests in the terminal during development.
app.use((0, morgan_1.default)("dev"));
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Privacy Verification Platform API is running",
    });
});
// Auth routes
app.use("/api/auth", auth_routes_1.default);
// I keep these temporary test routes to prove authentication and RBAC work.
// Later, i am gonna remove them or keep them only for development.
app.use("/api/auth/test", auth_testRoutes_1.default);
app.use("/api/verification-requests", verificationRequest_routes_1.default);
app.use("/api/consents", consent_routes_1.default);
app.use("/api/verifications", verification_routes_1.default);
app.use("/api/audit-logs", auditLog_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/health", health_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
// I keep this after all routes so it catches errors from the whole app.
app.use(errorHandler_1.errorHandler);
exports.default = app;
