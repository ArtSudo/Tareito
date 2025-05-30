import type { Request, RequestHandler, Response } from "express";
import { inboxService } from "./inboxService";

class InboxController {
  public getInboxByUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = Number.parseInt(req.params.userId as string, 10);
    const serviceResponse = await inboxService.findAllByUserId(userId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getInboxItem: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await inboxService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createInboxItem: RequestHandler = async (req: Request, res: Response) => {
    const userId = Number.parseInt(req.params.userId as string, 10);
    const { content } = req.body;
    const serviceResponse = await inboxService.createItem(userId, content);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public markInboxItemAsProcessed: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await inboxService.markAsProcessed(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getInboxItemsByStatus: RequestHandler = async (req: Request, res: Response) => {
    const status = req.query.status === "true";
    const serviceResponse = await inboxService.findByStatusProcessed(status);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getInboxByUserAndStatus: RequestHandler = async (req: Request, res: Response) => {
    const userId = Number.parseInt(req.params.userId as string, 10);
    const status = req.query.status === "true";
    const serviceResponse = await inboxService.findByUserAndStatusProcessed(userId, status);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const inboxController = new InboxController();
