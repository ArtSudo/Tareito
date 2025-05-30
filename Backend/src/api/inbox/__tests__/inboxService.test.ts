import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { StatusCodes } from "http-status-codes";

import { prisma } from "@/common/utils/prisma";
import { InboxService } from "@/api/inbox/inboxService";
import { UserService } from "@/api/user/userService";

let inboxService: InboxService;
let userService: UserService;
let baseUserId: number;

describe("InboxService", () => {
  beforeAll(async () => {
    inboxService = new InboxService();
    userService = new UserService();
    //await prisma.inboxItem.deleteMany();
    //await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    //await prisma.inboxItem.deleteMany();
  });

  afterAll(async () => {
    //await prisma.inboxItem.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a new inbox item", async () => {
    const user = await userService.create({
      name: "InboxService1",
      email: "InboxService1@example.com",
      password: "12345678",
    });

    baseUserId = user.responseObject?.id!;

    const res = await inboxService.createItem(baseUserId, "Mensaje de prueba");

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.success).toBe(true);
    expect(res.responseObject?.content).toBe("Mensaje de prueba");
  });

  it("should retrieve all inbox items by user ID", async () => {
    await inboxService.createItem(baseUserId, "Primer mensaje");
    await inboxService.createItem(baseUserId, "Segundo mensaje");

    const res = await inboxService.findAllByUserId(baseUserId);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject?.length).toBeGreaterThanOrEqual(2);
    expect(res.responseObject?.every(item => item.userId === baseUserId)).toBe(true);
  });

  it("should mark an inbox item as processed", async () => {
    const created = await inboxService.createItem(baseUserId, "Sin procesar");
    const id = created.responseObject!.id;

    const res = await inboxService.markAsProcessed(id);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject?.processed).toBe(true);
  });

  it("should return inbox items filtered by processed status", async () => {
    await inboxService.createItem(baseUserId, "Procesado");
    const toProcess = await inboxService.createItem(baseUserId, "Pendiente");

    await inboxService.markAsProcessed(toProcess.responseObject!.id);

    const processed = await inboxService.findByStatusProcessed(true);
    const unprocessed = await inboxService.findByStatusProcessed(false);

    expect(processed.responseObject.every(i => i.processed)).toBe(true);
    expect(unprocessed.responseObject.every(i => !i.processed)).toBe(true);
  });

  it("should return inbox items filtered by user ID and status", async () => {
    const user = await userService.create({
      name: "InboxService2",
      email: "InboxService2@example.com",
      password: "12345678",
    });

    const userId = user.responseObject!.id;

    await inboxService.createItem(userId, "Activo");
    const toMark = await inboxService.createItem(userId, "Pendiente");

    await inboxService.markAsProcessed(toMark.responseObject!.id);

    const res = await inboxService.findByUserAndStatusProcessed(userId, false);

    expect(res.responseObject.length).toBe(1);
    expect(res.responseObject[0].processed).toBe(false);
  });
});
