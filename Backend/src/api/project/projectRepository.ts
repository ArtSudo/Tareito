import { prisma } from "@/common/utils/prisma";
import type { Project } from "./projectModel";

export class ProjectRepository {
  async findAllByUserId(userId: number): Promise<Project[]> {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id } });
  }

  async create(userId: number, data: { title: string; description?: string }): Promise<Project> {
    return prisma.project.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? undefined,
      },
    });
  }
}
