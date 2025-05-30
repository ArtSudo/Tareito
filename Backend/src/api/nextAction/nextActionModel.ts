import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const NextActionSchema = z.object({
  id: commonValidations.id,
  content: z.string().openapi({ description: "Content of the next action" }),
  status: z.string().default("pending"),
  userId: z.number().int(),
  projectId: z.number().int().nullable().optional(),
  inboxItemId: z.number().int().nullable().optional(),
  contextId: z.number().int().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NextAction = z.infer<typeof NextActionSchema>;

export const CreateNextActionSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
  body: z.object({
    content: z.string().min(1),
    projectId: z.number().int().optional(),
    inboxItemId: z.number().int().optional(),
    contextId: z.number().int().optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const GetNextActionByIdSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});

export const GetNextActionsByUserSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
});
