import express from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { projectController } from "./projectController";
import {
  ProjectSchema,
  CreateProjectSchema,
  GetProjectByIdSchema,
  GetProjectsByUserSchema,
} from "./projectModel";
import { z } from "zod";

export const projectRegistry = new OpenAPIRegistry();
export const projectRouter = express.Router();

projectRegistry.register("Project", ProjectSchema);

projectRegistry.registerPath({
  method: "get",
  path: "/project/{userId}",
  tags: ["Project"],
  request: { params: GetProjectsByUserSchema.shape.params },
  responses: createApiResponse(z.array(ProjectSchema), "Success"),
});
projectRouter.get("/:userId", validateRequest(GetProjectsByUserSchema), projectController.getByUser);

projectRegistry.registerPath({
  method: "get",
  path: "/project/item/{id}",
  tags: ["Project"],
  request: { params: GetProjectByIdSchema.shape.params },
  responses: createApiResponse(ProjectSchema, "Success"),
});
projectRouter.get("/item/:id", validateRequest(GetProjectByIdSchema), projectController.getById);

projectRegistry.registerPath({
  method: "post",
  path: "/project/{userId}",
  tags: ["Project"],
  request: {
    params: CreateProjectSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreateProjectSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(ProjectSchema, "Created"),
});
projectRouter.post("/:userId", validateRequest(CreateProjectSchema), projectController.create);
