import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Context } from "@/api/context/contextModel";
import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { prisma } from "@/common/utils/prisma";

import { app } from "@/server";

describe("contextRouter", () => {
  let userId: number;
  let createdContextIds: number[] = [];

  beforeAll(async () => {
    //await prisma.context.deleteMany();
    //await prisma.user.deleteMany();

    const userPayload = {
      name: "Context Router Tester",
      email: "contextrouter@test.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/users/create")
      .send(userPayload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<User> = response.body;
    userId = body.responseObject?.id!;
  });

  afterAll(async () => {
    //await prisma.context.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a context for a user", async () => {
    const payload = { name: "@test-router" };

    const response = await request(app)
      .post(`/context/${userId}`)
      .send(payload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<Context> = response.body;

    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(body.success).toBe(true);
    expect(body.responseObject?.name).toBe(payload.name);
    expect(body.responseObject?.userId).toBe(userId);

    createdContextIds.push(body.responseObject!.id);
  });

  it("should get all contexts by user ID", async () => {
    const response = await request(app).get(`/context/${userId}`);
    const body: ServiceResponse<Context[]> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject.length).toBeGreaterThan(0);
    expect(body.responseObject.every(c => c.userId === userId)).toBe(true);
  });

  it("should get a context by its ID", async () => {
    const contextId = createdContextIds[0];

    const response = await request(app).get(`/context/item/${contextId}`);
    const body: ServiceResponse<Context> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject?.id).toBe(contextId);
  });

  it("should return 404 when context does not exist", async () => {
    const response = await request(app).get("/context/item/99999999");
    const body: ServiceResponse<Context | null> = response.body;

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(body.success).toBe(false);
    expect(body.responseObject).toBeNull();
  });
});
