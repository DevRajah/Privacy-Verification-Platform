import { z } from "zod";

// I validate the provider request before it enters my business logic.
// This protects the API from missing or invalid request data.
export const createVerificationRequestSchema = z.object({
  userEmail: z.string().email("Please provide a valid user email"),

  requestedAttribute: z.enum(["studentStatus", "housingEligible"], {
    message: "requestedAttribute must be studentStatus or housingEligible",
  }),

  purpose: z
    .string()
    .min(5, "Purpose must explain why this verification is needed"),
});