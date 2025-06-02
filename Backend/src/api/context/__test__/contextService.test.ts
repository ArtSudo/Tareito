import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";

import { prisma } from "@/common/utils/prisma";
import { ContextService } from "../contextService";
import { UserService } from "@/api/user/userService";
import type { Context } from "../contextModel";
import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";

let contextService: ContextService;
let userService: UserService;
let userId: number;
const createdContextIds: number[] = [];

describe("ContextService", () => {
  beforeAll(async () => {
    contextService = new ContextService();
    userService = new UserService();

    // Crear un usuario de prueba
    const user = await userService.create({
      name: "ContextTester",
      email: "context@test.com",
      password: "12345678",
    });

    userId = user.responseObject!.id;
  });

  afterAll(async () => {
    //await prisma.context.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a new context for the user", async () => {
    const name = "@home";

    const res = await contextService.create(userId, name);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.success).toBe(true);
    expect(res.responseObject?.name).toBe(name);
    expect(res.responseObject?.userId).toBe(userId);

    createdContextIds.push(res.responseObject!.id);
  });

  it("should retrieve all contexts by user ID", async () => {
    await contextService.create(userId, "@office");
    await contextService.create(userId, "@phone");

    const res = await contextService.findAllByUserId(userId);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.success).toBe(true);
    expect(res.responseObject.length).toBeGreaterThanOrEqual(2);
    expect(res.responseObject.every(c => c.userId === userId)).toBe(true);
  });

  it("should retrieve a context by ID", async () => {
    const id = createdContextIds[0];

    const res = await contextService.findById(id);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.success).toBe(true);
    expect(res.responseObject?.id).toBe(id);
  });

  it("should return 404 for non-existing context", async () => {
    const res = await contextService.findById(999999);

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.success).toBe(false);
    expect(res.responseObject).toBeNull();
  });
});
