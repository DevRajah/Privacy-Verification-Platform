import { z } from "zod";

// I validate user registration data before creating a user account.
export const registerUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  // These are demo verification attributes for the MVP.
  // In a real public-service system, these could come from trusted sources.
  studentStatus: z.boolean().optional(),
  housingEligible: z.boolean().optional(),
});

// I validate provider registration separately because providers use organisationName.
export const registerProviderSchema = z.object({
  organisationName: z
    .string()
    .min(2, "Organisation name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// I validate login data for both users and service providers.
export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),

  // This tells the backend which table to check during login.
  accountType: z.enum(["USER", "SERVICE_PROVIDER"], {
    message: "accountType must be USER or SERVICE_PROVIDER",
  }),
});