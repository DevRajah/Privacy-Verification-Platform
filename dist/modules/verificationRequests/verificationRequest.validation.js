"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVerificationRequestSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// I validate the provider request before it enters my business logic.
// This makes sure providers can only request approved, supported attributes.
// This is important for fine-grained attribute-scoped verification.
exports.createVerificationRequestSchema = zod_1.z.object({
    userEmail: zod_1.z.string().email("Please provide a valid user email"),
    requestedAttribute: zod_1.z.nativeEnum(client_1.VerificationAttribute, {
        message: "requestedAttribute must be STUDENT_STATUS or HOUSING_ELIGIBILITY",
    }),
    purpose: zod_1.z
        .string()
        .min(5, "Purpose must explain why this verification is needed"),
});
