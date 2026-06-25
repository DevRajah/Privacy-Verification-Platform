import request from "supertest";
import app from "../src/app";

describe("Health API", () => {
  test("should confirm API and database are online", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toBe("online");
    expect(res.body.data.database).toBe("connected");
  });
});