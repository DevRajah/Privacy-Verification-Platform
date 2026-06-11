import { VerificationAttribute } from "@prisma/client";

export type CreateVerificationRequestInput = {
  userEmail: string;
  requestedAttribute: VerificationAttribute;
  purpose: string;
};