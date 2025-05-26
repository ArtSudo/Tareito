import type { Request, RequestHandler, Response } from "express";
import { inboxService } from "./inboxService";
import { number } from "zod";

export class InboxController {
  
  public getInbox: RequestHandler = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const serviceResponse = await inboxService.findAllByUserId(userId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getItem: RequestHandler = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const serviceResponse = await inboxService.finById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public postItem: RequestHandler = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const { content } = req.body;
    const serviceResponse = await inboxService.createItem(userId, content);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public processItem: RequestHandler = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const serviceResponse = await inboxService.markAsProcessed(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const inboxController = new InboxController();
