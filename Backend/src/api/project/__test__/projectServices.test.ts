import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { StatusCodes } from "http-status-codes";

import { prisma } from "@/common/utils/prisma";
import { ProjectService } from "@/api/project/projectService";
import { UserService } from "@/api/user/userService";

let projectService: ProjectService;
let userService: UserService;
let baseUserId: number;

describe("ProjectService", () => {
  beforeAll(async () => {
    projectService = new ProjectService();
    userService = new UserService();
    //await prisma.project.deleteMany();
    //await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    //await prisma.project.deleteMany();
  });

  afterAll(async () => {
    //await prisma.project.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a new project", async () => {
    const user = await userService.create({
      name: "ProjectService1",
      email: "project1@example.com",
      password: "12345678",
    });

    baseUserId = user.responseObject!.id;

    const res = await projectService.create(baseUserId, {
      title: "Proyecto de prueba",
      description: "Descripción opcional",
    });

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.success).toBe(true);
    expect(res.responseObject?.title).toBe("Proyecto de prueba");
  });

  it("should retrieve all projects by user ID", async () => {
    await projectService.create(baseUserId, { title: "Uno" });
    await projectService.create(baseUserId, { title: "Dos" });

    const res = await projectService.findAllByUserId(baseUserId);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject.length).toBeGreaterThanOrEqual(2);
    expect(res.responseObject.every(p => p.userId === baseUserId)).toBe(true);
  });

  it("should return a project by ID", async () => {
    const created = await projectService.create(baseUserId, { title: "Específico" });

    const res = await projectService.findById(created.responseObject!.id);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject?.id).toBe(created.responseObject!.id);
  });

  it("should return 404 if project does not exist", async () => {
    const res = await projectService.findById(999999);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.responseObject).toBeNull();
  });
});
