import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { nextActionController } from "./nextActionController";
import { validateRequest } from "@/common/utils/httpHandlers";

import {
  NextActionSchema,
  CreateNextActionSchema,
  GetNextActionByIdSchema,
  GetNextActionsByUserSchema,
  GetNextActionsByProjectSchema,
  RequestNextActionStatusSchema,
  GetNextActionsByUserandStatusSchema
} from "./nextActionModel";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const nextActionRegistry = new OpenAPIRegistry();
export const nextActionRouter : Router = express.Router();

nextActionRegistry.register("NextAction", NextActionSchema);

// GET /next-action/:userId
nextActionRegistry.registerPath({
  method: "get",
  path: "/next-action/{userId}",
  tags: ["NextAction"],
  request: {
    params: GetNextActionsByUserSchema.shape.params,
  },
  responses: createApiResponse(z.array(NextActionSchema), "Success"),
});
nextActionRouter.get("/:userId", validateRequest(GetNextActionsByUserSchema), nextActionController.getByUser);

// GET /next-action/item/:id
nextActionRegistry.registerPath({
  method: "get",
  path: "/next-action/item/{id}",
  tags: ["NextAction"],
  request: {
    params: GetNextActionByIdSchema.shape.params,
  },
  responses: createApiResponse(NextActionSchema, "Success"),
});
nextActionRouter.get("/item/:id", validateRequest(GetNextActionByIdSchema), nextActionController.getById);

// GET /next-action/project/:projectId
nextActionRegistry.registerPath({
  method: "get",
  path: "/next-action/project/{projectId}",
  tags: ["NextAction"],
  request: {
    params: GetNextActionsByProjectSchema.shape.params,
  },
  responses: createApiResponse(z.array(NextActionSchema), "Success"),
});
nextActionRouter.get("/project/:projectId", validateRequest(z.object({ params: z.object({ projectId: z.coerce.number() }) })), nextActionController.getByProject);

// GET /next-action/:userId/status?status=pending
nextActionRegistry.registerPath({
  method: "get",
  path: "/next-action/{userId}/status",
  tags: ["NextAction"],
  request: {
    params: GetNextActionsByUserandStatusSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: GetNextActionsByUserandStatusSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(z.array(NextActionSchema), "Success"),
});
nextActionRouter.get(
  "/:userId/status",
  validateRequest(
    GetNextActionsByUserSchema.merge(
      z.object({ query: z.object({ status: z.enum(["pending", "done"]) }) })
    )
  ),
  nextActionController.getByUserAndStatus
);

// POST /next-action/:userId
nextActionRegistry.registerPath({
  method: "post",
  path: "/next-action/{userId}",
  tags: ["NextAction"],
  request: {
    params: CreateNextActionSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreateNextActionSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(NextActionSchema, "Created"),
});
nextActionRouter.post("/:userId", validateRequest(CreateNextActionSchema), nextActionController.create);

// PATCH /next-action/item/:id/done
nextActionRegistry.registerPath({
  method: "patch",
  path: "/next-action/item/{id}/done",
  tags: ["NextAction"],
  request: {
    params: GetNextActionByIdSchema.shape.params,
  },
  responses: createApiResponse(NextActionSchema, "Success"),
});
nextActionRouter.patch("/item/:id/done", validateRequest(GetNextActionByIdSchema), nextActionController.markAsDone);
