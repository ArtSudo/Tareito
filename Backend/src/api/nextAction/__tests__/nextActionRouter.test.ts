import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { NextAction } from "@/api/nextAction/nextActionModel";
import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { prisma } from "@/common/utils/prisma";

import { app } from "@/server";

describe("nextActionRouter", () => {
  let userId: number;
  let createdActionIds: number[] = [];

  beforeAll(async () => {
    //await prisma.nextAction.deleteMany();
    //await prisma.user.deleteMany();

    const userPayload = { name: "NextAction User", email: "nextaction@test.com", password: "12345678" };
    const response = await request(app)
      .post("/users/create")
      .send(userPayload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<User> = response.body;
    userId = body.responseObject?.id!;
  });

  afterAll(async () => {
    //await prisma.nextAction.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a next action", async () => {
    const content = "Tarea de prueba";

    const response = await request(app)
      .post(`/next-action/${userId}`)
      .send({ content })
      .set("Content-Type", "application/json");

    const body: ServiceResponse<NextAction> = response.body;

    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(body.success).toBe(true);
    expect(body.responseObject?.content).toBe(content);

    createdActionIds.push(body.responseObject!.id);
  });

  it("should retrieve all next actions by user ID", async () => {
    const response = await request(app).get(`/next-action/${userId}`);
    const body: ServiceResponse<NextAction[]> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject.every(item => item.userId === userId)).toBe(true);
  });

  it("should retrieve a next action by ID", async () => {
    const id = createdActionIds[0];

    const response = await request(app).get(`/next-action/item/${id}`);
    const body: ServiceResponse<NextAction> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject?.id).toBe(id);
  });

  it("should mark a next action as done", async () => {
    const id = createdActionIds[0];

    const response = await request(app).patch(`/next-action/item/${id}/done`);
    const body: ServiceResponse<NextAction> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject?.status).toBe("done");
  });

  it("should retrieve next actions filtered by status", async () => {
    await request(app)
      .post(`/next-action/${userId}`)
      .send({ content: "Pendiente aún" })
      .set("Content-Type", "application/json");

    const responsePending = await request(app).get(`/next-action/${userId}/status?status=pending`);
    const responseDone = await request(app).get(`/next-action/${userId}/status?status=done`);

    const pendingBody: ServiceResponse<NextAction[]> = responsePending.body;
    const doneBody: ServiceResponse<NextAction[]> = responseDone.body;

    expect(pendingBody.responseObject.every(a => a.status === "pending")).toBe(true);
    expect(doneBody.responseObject.every(a => a.status === "done")).toBe(true);
  });

  it("should retrieve next actions by project ID", async () => {
    const project = await prisma.project.create({
      data: {
        title: "Proyecto test",
        userId,
      },
    });

    const responseCreate = await request(app)
      .post(`/next-action/${userId}`)
      .send({ content: "Con proyecto", projectId: project.id })
      .set("Content-Type", "application/json");

    const response = await request(app).get(`/next-action/project/${project.id}`);
    const body: ServiceResponse<NextAction[]> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject.every(item => item.projectId === project.id)).toBe(true);
  });
});
