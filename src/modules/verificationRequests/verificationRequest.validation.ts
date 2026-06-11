import { z } from "zod";
import { VerificationAttribute } from "@prisma/client";

// I validate the provider request before it enters my business logic.
// This makes sure providers can only request approved, supported attributes.
// This is important for fine-grained attribute-scoped verification.
export const createVerificationRequestSchema = z.object({
  userEmail: z.string().email("Please provide a valid user email"),

  requestedAttribute: z.nativeEnum(VerificationAttribute, {
    message:
      "requestedAttribute must be STUDENT_STATUS or HOUSING_ELIGIBILITY",
  }),

  purpose: z
    .string()
    .min(5, "Purpose must explain why this verification is needed"),
});