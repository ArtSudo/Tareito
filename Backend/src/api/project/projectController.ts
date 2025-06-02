import type { Request, RequestHandler, Response } from "express";
import { projectService } from "./projectService";

class ProjectController {
  public getByUser: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const result = await projectService.findAllByUserId(userId);
    res.status(result.statusCode).send(result);
  };

  public getById: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await projectService.findById(id);
    res.status(result.statusCode).send(result);
  };

  public create: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { title, description } = req.body;
    const result = await projectService.create(userId, { title, description });
    res.status(result.statusCode).send(result);
  };
}

export const projectController = new ProjectController();
