import { prisma } from "@/common/utils/prisma";
import type { Context } from "./contextModel";

export class ContextRepository {
  async findAllByUserId(userId: number): Promise<Context[]> {
    return prisma.context.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<Context | null> {
    return prisma.context.findUnique({ where: { id } });
  }

  async create(userId: number, name: string): Promise<Context> {
    return prisma.context.create({
      data: { userId, name },
    });
  }
}
