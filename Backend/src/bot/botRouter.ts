import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { botController } from "./botController";
import { BotMessageRequestSchema, BotMessageResponseSchema } from "./botModel";

export const botRegistry = new OpenAPIRegistry();
export const botRouter: Router = express.Router();

botRegistry.registerPath({
  method: "post",
  path: "/bot/{userId}",
  tags: ["Bot"],
  request: {
    params: BotMessageRequestSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: BotMessageRequestSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(BotMessageResponseSchema, "Success"),
});

botRouter.post("/:userId", validateRequest(BotMessageRequestSchema), botController.sendMessage);
