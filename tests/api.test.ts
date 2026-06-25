import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/database";

let userToken: string;
let providerToken: string;
let adminToken: string;

let consentId: string;
let requestId: string;

const unique = Date.now();

const testUser = {
  fullName: "Test Citizen",
  email: `citizen-${unique}@example.com`,
  password: "password123",
  studentStatus: true,
  housingEligible: false,
};

const testProvider = {
  organisationName: "Test Housing Service",
  email: `provider-${unique}@example.com`,
  password: "password123",
};

const testAdmin = {
  fullName: "Test Admin",
  email: `admin-${unique}@example.com`,
  password: "password123",
  studentStatus: false,
  housingEligible: false,
};

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Privacy Verification Platform API", () => {
  test("Health endpoint should confirm API and database are online", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toBe("online");
    expect(res.body.data.database).toBe("connected");
  });

  test("User can register and receive token", async () => {
    const res = await request(app)
      .post("/api/auth/register-user")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);

    userToken = res.body.data.token;
  });

  test("Provider can register and receive token", async () => {
    const res = await request(app)
      .post("/api/auth/register-provider")
      .send(testProvider);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.provider.email).toBe(testProvider.email);

    providerToken = res.body.data.token;
  });

  test("User can login with accountType USER", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
      accountType: "USER",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.accountType).toBe("USER");

    userToken = res.body.data.token;
  });

  test("Provider can login with accountType SERVICE_PROVIDER", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testProvider.email,
      password: testProvider.password,
      accountType: "SERVICE_PROVIDER",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.accountType).toBe("SERVICE_PROVIDER");

    providerToken = res.body.data.token;
  });

  test("Provider can create a fine-grained verification request", async () => {
    const res = await request(app)
      .post("/api/verification-requests")
      .set("Authorization", `Bearer ${providerToken}`)
      .send({
        userEmail: testUser.email,
        requestedAttribute: "STUDENT_STATUS",
        purpose: "To confirm student eligibility for public-service access",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verificationRequest.requestedAttribute).toBe(
      "STUDENT_STATUS"
    );
    expect(res.body.data.consent.status).toBe("PENDING");

    requestId = res.body.data.verificationRequest.id;
    consentId = res.body.data.consent.id;
  });

  test("User can view their consent records", async () => {
    const res = await request(app)
      .get("/api/consents/my-consents")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("Verification is blocked before consent approval", async () => {
    const res = await request(app)
      .get(`/api/verifications/${requestId}/result`)
      .set("Authorization", `Bearer ${providerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("User can approve consent", async () => {
    const res = await request(app)
      .patch(`/api/consents/${consentId}/approve`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consent.status).toBe("APPROVED");
    expect(res.body.data.verificationRequest.status).toBe("APPROVED");
  });

  test("Provider receives minimal disclosure verification result", async () => {
    const res = await request(app)
      .get(`/api/verifications/${requestId}/result`)
      .set("Authorization", `Bearer ${providerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verifiedAttribute).toBe("STUDENT_STATUS");
    expect(res.body.data.result).toEqual({
      isActiveStudent: true,
    });

    // These checks prove the response is minimal and does not expose full identity data.
    expect(res.body.data.result.fullName).toBeUndefined();
    expect(res.body.data.result.email).toBeUndefined();
    expect(res.body.data.result.address).toBeUndefined();
    expect(res.body.data.result.passportNumber).toBeUndefined();
  });

  test("User can revoke approved consent", async () => {
    const res = await request(app)
      .patch(`/api/consents/${consentId}/revoke`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consent.status).toBe("REVOKED");
  });

  test("Verification is blocked after consent revocation", async () => {
    const res = await request(app)
      .get(`/api/verifications/${requestId}/result`)
      .set("Authorization", `Bearer ${providerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Protected route rejects missing token", async () => {
    const res = await request(app).get("/api/consents/my-consents");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("RBAC blocks user from provider dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/provider-summary")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("Create admin user and access admin dashboard summary", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register-user")
      .send(testAdmin);

    expect(registerRes.status).toBe(201);

    await prisma.user.update({
      where: { email: testAdmin.email },
      data: { role: "ADMIN" },
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: testAdmin.email,
      password: testAdmin.password,
      accountType: "USER",
    });

    adminToken = loginRes.body.data.token;

    const summaryRes = await request(app)
      .get("/api/dashboard/admin-summary")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.success).toBe(true);
    expect(summaryRes.body.data.totalUsers).toBeGreaterThanOrEqual(1);
    expect(summaryRes.body.data.totalProviders).toBeGreaterThanOrEqual(1);
  });
});