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

describe("Dashboard API", () => {
  test("user should access user dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/user-summary")
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalRequests).toBeGreaterThanOrEqual(1);
  });

  test("provider should access provider dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/provider-summary")
      .set("Authorization", `Bearer ${testContext.providerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalRequests).toBeGreaterThanOrEqual(1);
  });

  test("user should be blocked from provider dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/provider-summary")
      .set("Authorization", `Bearer ${testContext.userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});