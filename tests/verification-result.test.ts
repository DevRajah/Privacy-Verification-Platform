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

describe("Verification Result API", () => {
  test("verification should be blocked before consent approval", async () => {
    const res = await request(app)
      .get(`/api/verifications/${testContext.requestId}/result`)
      .set("Authorization", `Bearer ${testContext.providerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("provider should receive minimal disclosure result after approval", async () => {
    await request(app)
      .patch(`/api/consents/${testContext.consentId}/approve`)
      .set("Authorization", `Bearer ${testContext.userToken}`);

    const res = await request(app)
      .get(`/api/verifications/${testContext.requestId}/result`)
      .set("Authorization", `Bearer ${testContext.providerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verifiedAttribute).toBe("STUDENT_STATUS");
    expect(res.body.data.result).toEqual({
      isActiveStudent: true,
    });

    expect(res.body.data.result.fullName).toBeUndefined();
    expect(res.body.data.result.email).toBeUndefined();
    expect(res.body.data.result.address).toBeUndefined();
    expect(res.body.data.result.passportNumber).toBeUndefined();
  });

  test("verification should be blocked after consent revocation", async () => {
    await request(app)
      .patch(`/api/consents/${testContext.consentId}/revoke`)
      .set("Authorization", `Bearer ${testContext.userToken}`);

    const res = await request(app)
      .get(`/api/verifications/${testContext.requestId}/result`)
      .set("Authorization", `Bearer ${testContext.providerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});