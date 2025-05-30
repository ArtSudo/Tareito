// inboxModel.ts (complementario)
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const InboxItemSchema = z.object({
  id: commonValidations.id,
  content: z.string().openapi({ description: "Content of the inbox item" }),
  processed: z.boolean().default(false).openapi({ description: "Whether the inbox item has been processed" }),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InboxItem = z.infer<typeof InboxItemSchema>;

export const GetInboxItemSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});

export const GetInboxByUserSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
});

export const GetByStatusSchema = z.object({
  query: z.object({
    status: z.enum(["true", "false"]),
  }),
});

export const CreateInboxItemSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});

export const ProcessInboxItemSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});
