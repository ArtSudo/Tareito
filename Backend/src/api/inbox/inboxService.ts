import { InboxRepository } from './inboxRepository';
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import type { InboxItem } from "./inboxModel";

export class InboxService {
  constructor(readonly repo = new InboxRepository()) {}

  async findAllByUserId(userId: number): Promise<ServiceResponse<InboxItem[]>> {
    try {
      const items = await this.repo.findAllbyUserId(userId);
      return ServiceResponse.success("Inbox loaded", items);
    } catch (ex) {
      const errorMessage = `Error loading inbox for user ${userId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to load inbox", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<ServiceResponse<InboxItem | null>> {
    try {
      const item = await this.repo.findById(id);
      if (!item) {
        return ServiceResponse.failure("Inbox item not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Inbox item found", item);
    } catch (ex) {
      const errorMessage = `Error finding inbox item with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to retrieve inbox item", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByStatusProcessed(status: boolean): Promise<ServiceResponse<InboxItem[]>> {
    try {
      const items = await this.repo.findByStatusProcessed(status);
      return ServiceResponse.success("Inbox items filtered by processed status", items);
    } catch (ex) {
      const errorMessage = `Error filtering inbox items by status=${status}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to filter inbox items", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByUserAndStatusProcessed(userId: number, status: boolean): Promise<ServiceResponse<InboxItem[]>> {
    try {
      const items = await this.repo.findByUserAndStatusProcessed(userId, status);
      return ServiceResponse.success("Inbox items filtered by user and status", items);
    } catch (ex) {
      const errorMessage = `Error filtering inbox for user ${userId} with status=${status}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to filter inbox items", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createItem(userId: number, content: string): Promise<ServiceResponse<InboxItem | null>> {
    try {
      const item = await this.repo.create(userId, content);
      return ServiceResponse.success("Inbox item created", item, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating inbox item for user ${userId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to create inbox item", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async markAsProcessed(id: number): Promise<ServiceResponse<InboxItem | null>> {
    try {
      const item = await this.repo.markAsProcessed(id);
      return ServiceResponse.success("Inbox item marked as processed", item);
    } catch (ex) {
      const errorMessage = `Error processing inbox item with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Failed to mark inbox item as processed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const inboxService = new InboxService();
