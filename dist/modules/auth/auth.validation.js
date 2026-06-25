"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerProviderSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// I validate user registration data before creating a user account.
exports.registerUserSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    // These are demo verification attributes for the MVP.
    // In a real public-service system, these could come from trusted sources.
    studentStatus: zod_1.z.boolean().optional(),
    housingEligible: zod_1.z.boolean().optional(),
});
// I validate provider registration separately because providers use organisationName.
exports.registerProviderSchema = zod_1.z.object({
    organisationName: zod_1.z
        .string()
        .min(2, "Organisation name must be at least 2 characters"),
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// I validate login data for both users and service providers.
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please provide a valid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
    // This tells the backend which table to check during login.
    accountType: zod_1.z.enum(["USER", "SERVICE_PROVIDER"], {
        message: "accountType must be USER or SERVICE_PROVIDER",
    }),
});
