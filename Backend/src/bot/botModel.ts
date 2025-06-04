import { z } from "zod";

export const BotMessageRequestSchema = z.object({
  body: z.object({
    message: z.string().min(1),
  }),
  params: z.object({
    userId: z.string().min(1),
  }),
});

export const BotMessageResponseSchema = z.object({
  response: z.string(),
});
