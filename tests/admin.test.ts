import request from "supertest";
import app from "../src/app";
import { registerBaseAccounts, testContext } from "./helpers/setup";

beforeAll(async () => {
  await registerBaseAccounts();
});

describe("Admin API", () => {
  test("admin should access admin dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/admin-summary")
      .set("Authorization", `Bearer ${testContext.adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(1);
    expect(res.body.data.totalProviders).toBeGreaterThanOrEqual(1);
  });

  test("provider should be blocked from admin summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/admin-summary")
      .set("Authorization", `Bearer ${testContext.providerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("admin should access all audit logs", async () => {
    const res = await request(app)
      .get("/api/admin/audit-logs")
      .set("Authorization", `Bearer ${testContext.adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});