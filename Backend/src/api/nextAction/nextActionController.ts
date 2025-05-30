import type { Request, RequestHandler, Response } from "express";
import { nextActionService } from "./nextActionService";

class NextActionController {
  public getByUser: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const result = await nextActionService.findAllByUserId(userId);
    res.status(result.statusCode).send(result);
  };

  public getById: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await nextActionService.findById(id);
    res.status(result.statusCode).send(result);
  };

  public getByProject: RequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await nextActionService.findAllByProjectId(projectId);
    res.status(result.statusCode).send(result);
  };

  public getByUserAndStatus: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const status = req.query.status as string;
    const result = await nextActionService.findAllByUserIdAndStatus(userId, status);
    res.status(result.statusCode).send(result);
  };

  public create: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const result = await nextActionService.create(userId, req.body);
    res.status(result.statusCode).send(result);
  };

  public markAsDone: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await nextActionService.markAsDone(id);
    res.status(result.statusCode).send(result);
  };
}

export const nextActionController = new NextActionController();
