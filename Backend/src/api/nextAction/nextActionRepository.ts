import { prisma } from "@/common/utils/prisma";
import type { NextAction } from "./nextActionModel";

export class NextActionRepository {
  async findAllByUserId(userId: number): Promise<NextAction[]> {
    return prisma.nextAction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<NextAction | null> {
    return prisma.nextAction.findUnique({ where: { id } });
  }

  async findAllByUserIdAndStatus(userId: number, status: string): Promise<NextAction[]> {
    return prisma.nextAction.findMany({
      where: { userId, status },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllByProjectId(projectId: number): Promise<NextAction[]> {
    return prisma.nextAction.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(userId: number, data: Partial<NextAction>): Promise<NextAction> {
    return prisma.nextAction.create({
      data: { ...data, userId } as NextAction,
    });
  }

  async markAsDone(id: number): Promise<NextAction> {
    return prisma.nextAction.update({
      where: { id },
      data: { status: "done", updatedAt: new Date() },
    });
  }
}
