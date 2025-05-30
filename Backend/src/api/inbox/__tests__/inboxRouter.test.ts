import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { InboxItem } from "@/api/inbox/inboxModel";
import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { prisma } from "@/common/utils/prisma";

import { app } from "@/server";

describe("inboxRouter", () => {
  let userId: number;
  const createdInboxIds: number[] = [];

  beforeAll(async () => {
    //await prisma.inboxItem.deleteMany();
    //await prisma.user.deleteMany();
    // Crear usuario para asociar con inbox
    const userPayload = { name: "Inbox Tester", email: "inbox@test.com", password: "12345678" };
    const response = await request(app)
      .post("/users/create")
      .send(userPayload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<User> = response.body;
    userId = body.responseObject?.id!;
  });

  afterAll(async () => {
    //await prisma.inboxItem.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });


  it("should create inbox items for a user", async () => {
    const messages = ["Mensaje A", "Mensaje B"];
    for (const content of messages) {
      const response = await request(app)
        .post(`/inbox/${userId}`)
        .send({ content })
        .set("Content-Type", "application/json");

      const body: ServiceResponse<InboxItem> = response.body;
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(body.success).toBeTruthy();
      expect(body.responseObject?.content).toBe(content);
      expect(body.responseObject?.userId).toBe(userId);

      createdInboxIds.push(body.responseObject!.id);
    }
  });

  it("should get inbox items by user ID", async () => {
    const response = await request(app).get(`/inbox/${userId}`);
    const body: ServiceResponse<InboxItem[]> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBeTruthy();
    expect(body.responseObject.some(item => item.userId === userId)).toBe(true);
  });

  it("should mark inbox item as processed", async () => {
    const id = createdInboxIds[0];

    const response = await request(app).patch(`/inbox/item/${id}/process`);
    const body: ServiceResponse<InboxItem> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBeTruthy();
    expect(body.responseObject?.processed).toBe(true);
  });

  it("should return inbox item by ID", async () => {
    const id = createdInboxIds[0];

    const response = await request(app).get(`/inbox/item/${id}`);
    const body: ServiceResponse<InboxItem> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBeTruthy();
    expect(body.responseObject?.id).toBe(id);
  });

  // Opcional: Test de filtrado por estado o combinación con el schema
});
