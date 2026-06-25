import request from "supertest";
import app from "../src/app";
import { registerBaseAccounts, testContext } from "./helpers/setup";
import { testUser } from "./helpers/testData";

beforeAll(async () => {
  await registerBaseAccounts();
});

describe("Verification Request API", () => {
  test("provider should create a scoped verification request", async () => {
    const res = await request(app)
      .post("/api/verification-requests")
      .set("Authorization", `Bearer ${testContext.providerToken}`)
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

    testContext.requestId = res.body.data.verificationRequest.id;
    testContext.consentId = res.body.data.consent.id;
  });

  test("user should view their verification requests", async () => {
    const res = await request(app)
      .get("/api/verification-requests/user")
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("user should not create provider verification request", async () => {
    const res = await request(app)
      .post("/api/verification-requests")
      .set("Authorization", `Bearer ${testContext.userToken}`)
      .send({
        userEmail: testUser.email,
        requestedAttribute: "STUDENT_STATUS",
        purpose: "Invalid attempt",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});