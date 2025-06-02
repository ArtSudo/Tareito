import { ProjectRepository } from "./projectRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import type { Project } from "./projectModel";

export class ProjectService {
  constructor(readonly repo = new ProjectRepository()) {}

  async findAllByUserId(userId: number): Promise<ServiceResponse<Project[]>> {
    try {
      const data = await this.repo.findAllByUserId(userId);
      return ServiceResponse.success("Projects loaded", data);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to load projects", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<ServiceResponse<Project | null>> {
    try {
      const item = await this.repo.findById(id);
      if (!item) return ServiceResponse.failure("Not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Project found", item);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to retrieve project", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userId: number, data: { title: string; description?: string }): Promise<ServiceResponse<Project | null>> {
    try {
      const item = await this.repo.create(userId, data);
      return ServiceResponse.success("Project created", item, StatusCodes.CREATED);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to create project", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const projectService = new ProjectService();
