// inboxRouter.ts
import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { inboxController } from "./inboxController";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  InboxItemSchema,
  CreateInboxItemSchema,
  GetInboxItemSchema,
  GetInboxByUserSchema,
  GetByStatusSchema,
  ProcessInboxItemSchema,
} from "./inboxModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const inboxRegistry = new OpenAPIRegistry();
export const inboxRouter: Router = express.Router();

inboxRegistry.register("InboxItem", InboxItemSchema);

// GET /inbox/:userId
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/{userId}",
  tags: ["Inbox"],
  request: { params: GetInboxByUserSchema.shape.params },
  responses: createApiResponse(z.array(InboxItemSchema), "Success"),
});
inboxRouter.get("/:userId", validateRequest(GetInboxByUserSchema), inboxController.getInboxByUser);

// GET /inbox/item/:id
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/item/{id}",
  tags: ["Inbox"],
  request: { params: GetInboxItemSchema.shape.params },
  responses: createApiResponse(InboxItemSchema, "Success"),
});
inboxRouter.get("/item/:id", validateRequest(GetInboxItemSchema), inboxController.getInboxItem);

// POST /inbox/:userId
inboxRegistry.registerPath({
  method: "post",
  path: "/inbox/{userId}",
  tags: ["Inbox"],
  request: {
    params: CreateInboxItemSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreateInboxItemSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(InboxItemSchema, "Created"),
});
inboxRouter.post("/:userId", validateRequest(CreateInboxItemSchema), inboxController.createInboxItem);

// PATCH /inbox/item/:id/process
inboxRegistry.registerPath({
  method: "patch",
  path: "/inbox/item/{id}/process",
  tags: ["Inbox"],
  request: { params: ProcessInboxItemSchema.shape.params },
  responses: createApiResponse(InboxItemSchema, "Success"),
});
inboxRouter.patch("/item/:id/process", validateRequest(ProcessInboxItemSchema), inboxController.markInboxItemAsProcessed);

// GET /inbox/status?status=true
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/status",
  tags: ["Inbox"],
  request: { query: GetByStatusSchema.shape.query },
  responses: createApiResponse(z.array(InboxItemSchema), "Success"),
});
inboxRouter.get("/status", validateRequest(GetByStatusSchema), inboxController.getInboxItemsByStatus);

// GET /inbox/:userId/status?status=true
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/{userId}/status",
  tags: ["Inbox"],
  request: {
    params: GetInboxByUserSchema.shape.params,
    query: GetByStatusSchema.shape.query,
  },
  responses: createApiResponse(z.array(InboxItemSchema), "Success"),
});
inboxRouter.get("/:userId/status", validateRequest(GetInboxByUserSchema.merge(GetByStatusSchema)), inboxController.getInboxByUserAndStatus);
