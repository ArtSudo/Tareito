import express, { type Router } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { inboxController } from "./inboxController";
import { InboxItemSchema, UserPathParamSchema, CreateInboxItemSchema, InboxItemIdParamSchema, CreateInboxItemRequestSchema } from "./inboxModel";

export const inboxRegistry = new OpenAPIRegistry();
export const inboxRouter: Router = express.Router();

inboxRegistry.register("InboxItem", InboxItemSchema);

// 🧪 GET /inbox/user/:userId
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/user/{userId}",
  tags: ["Inbox"],
  request: { params: UserPathParamSchema },
  responses: createApiResponse(z.array(InboxItemSchema), "Success"),
});
inboxRouter.get("/user/:userId", validateRequest(UserPathParamSchema), inboxController.getInbox);

// 📥 POST /inbox/user/:userId
inboxRegistry.registerPath({
  method: "post",
  path: "/inbox/user/{userId}",
  tags: ["Inbox"],
  request: {
    params: UserPathParamSchema,
    body: { content: { "application/json": { schema: CreateInboxItemSchema } } },
  },
  responses: createApiResponse(InboxItemSchema, "Created"),
});
inboxRouter.post("/user/:userId", validateRequest( CreateInboxItemRequestSchema ), inboxController.postItem);

// 🔍 GET /inbox/:id
inboxRegistry.registerPath({
  method: "get",
  path: "/inbox/{id}",
  tags: ["Inbox"],
  request: { params: InboxItemIdParamSchema },
  responses: createApiResponse(InboxItemSchema, "Success"),
});
inboxRouter.get("/:id", validateRequest(InboxItemIdParamSchema), inboxController.getItem);

// ✅ PATCH /inbox/:id/process
inboxRegistry.registerPath({
  method: "patch",
  path: "/inbox/{id}/process",
  tags: ["Inbox"],
  request: { params: InboxItemIdParamSchema },
  responses: createApiResponse(InboxItemSchema, "Success"),
});
inboxRouter.patch("/:id/process", validateRequest(InboxItemIdParamSchema), inboxController.processItem);