import { InboxRepository } from './inboxRepository';
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";


export class InboxService {
  constructor(readonly repo = new InboxRepository()) {}

  async findAllByUserId(userId: number) {
    const items = await this.repo.findAllbyUserId(userId);

    return ServiceResponse.success("Inbox loaded", items);
  }

  async finById(id: number) {
    const item = await this.repo.findById(id);
    return item
      ? ServiceResponse.success("Inbox item found", item)
      : ServiceResponse.failure("Not found", null, StatusCodes.NOT_FOUND);
  }


  async createItem(userId: number, content: string) {
    const item = await this.repo.create(userId, content);
    return ServiceResponse.success("Create inbox item", item);
  }

  async markAsProcessed(id: number) {
    const item = await this.repo.markAsProcessed(id);
    return ServiceResponse.success("Inbox Processed",item);
  }
  
};

export const inboxService = new InboxService();