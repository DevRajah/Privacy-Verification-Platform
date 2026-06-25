import request from "supertest";
import app from "../src/app";
import { testProvider, testUser } from "./helpers/testData";

describe("Auth API", () => {
  test("should register a user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/register-user")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  test("should register a provider and return token", async () => {
    const res = await request(app)
      .post("/api/auth/register-provider")
      .send(testProvider);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.provider.email).toBe(testProvider.email);
  });

  test("should login user with accountType USER", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
      accountType: "USER",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accountType).toBe("USER");
    expect(res.body.data.token).toBeDefined();
  });

  test("should reject provider login with wrong accountType value", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testProvider.email,
      password: testProvider.password,
      accountType: "PROVIDER",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});