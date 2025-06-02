import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { StatusCodes } from "http-status-codes";

import { prisma } from "@/common/utils/prisma";
import { NextActionService } from "@/api/nextAction/nextActionService";
import { NextAction } from "@/api/nextAction/nextActionModel";
import { UserService } from "@/api/user/userService";

let nextActionService: NextActionService;
let userService: UserService;
let baseUserId: number;

describe("NextActionService", () => {
  beforeAll(async () => {
    nextActionService = new NextActionService();
    userService = new UserService();
  });

  beforeEach(async () => {
    //await prisma.nextAction.deleteMany();
  });

  afterAll(async () => {
    //await prisma.nextAction.deleteMany();
    //await prisma.user.deleteMany();
    //await prisma.$disconnect();
  });

  it("should create a new next action", async () => {
    const user = await userService.create({
      name: "NextActionUser1",
      email: "NextActionUser1@example.com",
      password: "12345678",
    });

    baseUserId = user.responseObject?.id!;

    const res = await nextActionService.create(baseUserId, {content: "Next action test"} as NextAction);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.success).toBe(true);
    expect(res.responseObject?.content).toBe("Next action test");
  });

  it("should retrieve all next actions by user ID", async () => {
    await nextActionService.create(baseUserId, {content: "First action"} as NextAction);
    await nextActionService.create(baseUserId, {content: "Second action"}  as NextAction);

    const res = await nextActionService.findAllByUserId(baseUserId);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject?.length).toBeGreaterThanOrEqual(2);
    expect(res.responseObject?.every(action => action.userId === baseUserId)).toBe(true);
  });

  it("should mark a next action as completed", async () => {
    const created = await nextActionService.create(baseUserId, {content: "Incomplete action"} as NextAction);
    const id = created.responseObject!.id;

    const res = await nextActionService.markAsDone(id);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.responseObject?.status).toBe("done");
  });

  it("should return next actions filtered by completion status", async () => {
    await nextActionService.create(baseUserId, {content: "Completed action"} as NextAction);
    const toComplete = await nextActionService.create(baseUserId, {content: "Pending action"} as NextAction);

    await nextActionService.markAsDone(toComplete.responseObject!.id);

    const completed = await nextActionService.findAllByUserIdAndStatus(baseUserId, "done");
    const uncompleted = await nextActionService.findAllByUserIdAndStatus(baseUserId,"pending");

    expect(completed.responseObject.every(a => a.status == "done")).toBe(true);
    expect(uncompleted.responseObject.every(a => a.status == "pending")).toBe(true);
  });

  it("should return next actions filtered by user ID and status", async () => {
    const user = await userService.create({
      name: "NextActionUser2",
      email: "NextActionUser2@example.com",
      password: "12345678",
    });

    const userId = user.responseObject!.id;

    await nextActionService.create(userId, {content: "Active action"} as NextAction);
    const toMark = await nextActionService.create(userId, {content: "Pending action"} as NextAction);

    await nextActionService.markAsDone(toMark.responseObject!.id);

    const res = await nextActionService.findAllByUserIdAndStatus(baseUserId,"done");

    expect(res.responseObject.length).toBe(1);
    expect(res.responseObject[0].status).toBe("done");
  });

});
