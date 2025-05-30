import { NextActionRepository } from "./nextActionRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import type { NextAction } from "./nextActionModel";

export class NextActionService {
  constructor(readonly repo = new NextActionRepository()) {}

  async findAllByUserId(userId: number): Promise<ServiceResponse<NextAction[]>> {
    try {
      const actions = await this.repo.findAllByUserId(userId);
      return ServiceResponse.success("Next actions loaded", actions);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to load next actions", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<ServiceResponse<NextAction | null>> {
    try {
      const action = await this.repo.findById(id);
      if (!action) return ServiceResponse.failure("Not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Found", action);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to retrieve next action", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByProjectId(projectId: number): Promise<ServiceResponse<NextAction[]>> {
    try {
      const actions = await this.repo.findAllByProjectId(projectId);
      return ServiceResponse.success("Next actions loaded", actions);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to load next actions", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByUserIdAndStatus(userId: number, status: string): Promise<ServiceResponse<NextAction[]>> {
    try {
      const actions = await this.repo.findAllByUserIdAndStatus(userId, status);
      return ServiceResponse.success("Next actions loaded", actions);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to load next actions", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userId: number, data: Partial<NextAction>): Promise<ServiceResponse<NextAction | null>> {
    try {
      const action = await this.repo.create(userId, data);
      return ServiceResponse.success("Next action created", action, StatusCodes.CREATED);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Creation failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async markAsDone(id: number): Promise<ServiceResponse<NextAction | null>> {
    try {
      const updated = await this.repo.markAsDone(id);
      return ServiceResponse.success("Marked as done", updated);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to mark as done", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const nextActionService = new NextActionService();
