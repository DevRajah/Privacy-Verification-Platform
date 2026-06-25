export const unique = Date.now();

export const testUser = {
  fullName: "Test Citizen",
  email: `citizen-${unique}@example.com`,
  password: "password123",
  studentStatus: true,
  housingEligible: false,
};

export const secondTestUser = {
  fullName: "Second Test Citizen",
  email: `second-citizen-${unique}@example.com`,
  password: "password123",
  studentStatus: false,
  housingEligible: true,
};

export const testProvider = {
  organisationName: "Test Housing Service",
  email: `provider-${unique}@example.com`,
  password: "password123",
};

export const secondTestProvider = {
  organisationName: "Second Test Council",
  email: `second-provider-${unique}@example.com`,
  password: "password123",
};

export const testAdmin = {
  fullName: "Test Admin",
  email: `admin-${unique}@example.com`,
  password: "password123",
  studentStatus: false,
  housingEligible: false,
};