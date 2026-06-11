export type CreateVerificationRequestInput = {
  userEmail: string;
  requestedAttribute: "studentStatus" | "housingEligible";
  purpose: string;
};