import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { contextController } from "./contextController";
import {
  ContextSchema,
  CreateContextSchema,
  GetContextByIdSchema,
  GetContextsByUserSchema,
} from "./contextModel";
import { z } from "zod";

export const contextRegistry = new OpenAPIRegistry();
export const contextRouter:Router = express.Router();

contextRegistry.register("Context", ContextSchema);

contextRegistry.registerPath({
  method: "get",
  path: "/context/{userId}",
  tags: ["Context"],
  request: { params: GetContextsByUserSchema.shape.params },
  responses: createApiResponse(z.array(ContextSchema), "Success"),
});
contextRouter.get("/:userId", validateRequest(GetContextsByUserSchema), contextController.getByUser);

contextRegistry.registerPath({
  method: "get",
  path: "/context/item/{id}",
  tags: ["Context"],
  request: { params: GetContextByIdSchema.shape.params },
  responses: createApiResponse(ContextSchema, "Success"),
});
contextRouter.get("/item/:id", validateRequest(GetContextByIdSchema), contextController.getById);

contextRegistry.registerPath({
  method: "post",
  path: "/context/{userId}",
  tags: ["Context"],
  request: {
    params: CreateContextSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreateContextSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(ContextSchema, "Created"),
});
contextRouter.post("/:userId", validateRequest(CreateContextSchema), contextController.create);
