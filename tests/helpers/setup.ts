import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/database";
import {
  secondTestProvider,
  secondTestUser,
  testAdmin,
  testProvider,
  testUser,
} from "./testData";

export type TestContext = {
  userToken: string;
  providerToken: string;
  secondUserToken: string;
  secondProviderToken: string;
  adminToken: string;
  requestId: string;
  consentId: string;
};

export const testContext: TestContext = {
  userToken: "",
  providerToken: "",
  secondUserToken: "",
  secondProviderToken: "",
  adminToken: "",
  requestId: "",
  consentId: "",
};

export const registerBaseAccounts = async () => {
  const userRes = await request(app)
    .post("/api/auth/register-user")
    .send(testUser);

  testContext.userToken = userRes.body.data.token;

  const secondUserRes = await request(app)
    .post("/api/auth/register-user")
    .send(secondTestUser);

  testContext.secondUserToken = secondUserRes.body.data.token;

  const providerRes = await request(app)
    .post("/api/auth/register-provider")
    .send(testProvider);

  testContext.providerToken = providerRes.body.data.token;

  const secondProviderRes = await request(app)
    .post("/api/auth/register-provider")
    .send(secondTestProvider);

  testContext.secondProviderToken = secondProviderRes.body.data.token;

  const adminRes = await request(app)
    .post("/api/auth/register-user")
    .send(testAdmin);

  await prisma.user.update({
    where: { email: testAdmin.email },
    data: { role: "ADMIN" },
  });

  const adminLoginRes = await request(app).post("/api/auth/login").send({
    email: testAdmin.email,
    password: testAdmin.password,
    accountType: "USER",
  });

  testContext.adminToken = adminLoginRes.body.data.token;

  return {
    userRes,
    secondUserRes,
    providerRes,
    secondProviderRes,
    adminRes,
  };
};

export const createPendingVerificationRequest = async () => {
  const res = await request(app)
    .post("/api/verification-requests")
    .set("Authorization", `Bearer ${testContext.providerToken}`)
    .send({
      userEmail: testUser.email,
      requestedAttribute: "STUDENT_STATUS",
      purpose: "To confirm student eligibility for public-service access",
    });

  testContext.requestId = res.body.data.verificationRequest.id;
  testContext.consentId = res.body.data.consent.id;

  return res;
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};