import type { Request, RequestHandler, Response } from "express";
import { contextService } from "./contextService";

class ContextController {
  public getByUser: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const result = await contextService.findAllByUserId(userId);
    res.status(result.statusCode).send(result);
  };

  public getById: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await contextService.findById(id);
    res.status(result.statusCode).send(result);
  };

  public create: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { name } = req.body;
    const result = await contextService.create(userId, name);
    res.status(result.statusCode).send(result);
  };
}

export const contextController = new ContextController();
