import { ContextRepository } from "./contextRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import type { Context } from "./contextModel";

export class ContextService {
  constructor(readonly repo = new ContextRepository()) {}

  async findAllByUserId(userId: number): Promise<ServiceResponse<Context[]>> {
    try {
      const data = await this.repo.findAllByUserId(userId);
      return ServiceResponse.success("Contexts loaded", data);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to load contexts", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<ServiceResponse<Context | null>> {
    try {
      const item = await this.repo.findById(id);
      if (!item) return ServiceResponse.failure("Not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Context found", item);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to retrieve context", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userId: number, name: string): Promise<ServiceResponse<Context | null>> {
    try {
      const item = await this.repo.create(userId, name);
      return ServiceResponse.success("Context created", item, StatusCodes.CREATED);
    } catch (ex) {
      logger.error(ex);
      return ServiceResponse.failure("Failed to create context", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const contextService = new ContextService();
