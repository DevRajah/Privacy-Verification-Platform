import request from "supertest";
import app from "../src/app";
import {
  createPendingVerificationRequest,
  registerBaseAccounts,
  testContext,
} from "./helpers/setup";

beforeAll(async () => {
  await registerBaseAccounts();
  await createPendingVerificationRequest();
});

describe("Consent API", () => {
  test("user should view consent records", async () => {
    const res = await request(app)
      .get("/api/consents/my-consents")
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("user should approve pending consent", async () => {
    const res = await request(app)
      .patch(`/api/consents/${testContext.consentId}/approve`)
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consent.status).toBe("APPROVED");
    expect(res.body.data.verificationRequest.status).toBe("APPROVED");
  });

  test("same consent should not be approved twice", async () => {
    const res = await request(app)
      .patch(`/api/consents/${testContext.consentId}/approve`)
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});