export type RegisterUserInput = {
  fullName: string;
  email: string;
  password: string;
  studentStatus?: boolean;
  housingEligible?: boolean;
};

export type RegisterProviderInput = {
  organisationName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
  accountType: "USER" | "SERVICE_PROVIDER";
};