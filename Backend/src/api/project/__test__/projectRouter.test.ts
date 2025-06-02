import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Project } from "@/api/project/projectModel";
import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { prisma } from "@/common/utils/prisma";

import { app } from "@/server";

describe("projectRouter", () => {
  let userId: number;
  let createdProjectIds: number[] = [];

  beforeAll(async () => {
    //await prisma.project.deleteMany();
    //await prisma.user.deleteMany();

    const userPayload = { name: "Project Router", email: "projectRouter@test.com", password: "12345678" };
    const response = await request(app)
      .post("/users/create")
      .send(userPayload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<User> = response.body;
    userId = body.responseObject?.id!;
  });

  afterAll(async () => {
    //await prisma.project.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a project for the user", async () => {
    const payload = { title: "Proyecto 1", description: "Descripción 1" };

    const response = await request(app)
      .post(`/project/${userId}`)
      .send(payload)
      .set("Content-Type", "application/json");

    const body: ServiceResponse<Project> = response.body;

    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(body.success).toBe(true);
    expect(body.responseObject?.title).toBe(payload.title);
    expect(body.responseObject?.userId).toBe(userId);

    createdProjectIds.push(body.responseObject!.id);
  });

  it("should get all projects by user ID", async () => {
    const response = await request(app).get(`/project/${userId}`);
    const body: ServiceResponse<Project[]> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject.some(p => p.userId === userId)).toBe(true);
  });

  it("should get a project by its ID", async () => {
    const projectId = createdProjectIds[0];

    const response = await request(app).get(`/project/item/${projectId}`);
    const body: ServiceResponse<Project> = response.body;

    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(body.success).toBe(true);
    expect(body.responseObject?.id).toBe(projectId);
  });

  it("should return 404 when project does not exist", async () => {
    const response = await request(app).get("/project/item/99999999");
    const body: ServiceResponse<Project | null> = response.body;

    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(body.success).toBe(false);
    expect(body.responseObject).toBeNull();
  });
});
