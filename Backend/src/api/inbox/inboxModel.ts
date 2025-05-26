import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";
import { InboxItem as PrismaInboxItem } from '../../generated/prisma';
//export type InboxItem = PrismaInboxItem;

extendZodWithOpenApi(z);
export const InboxItemSchema = z.object({
  id: z.number().int(),
  content: z.string().openapi({description: "Content of the inbox item"}),
  capturedAt: z.date(),
  processed: z.boolean().default(false).openapi({description: "Content of the inbox item"}),
  userId: z.number().int(),
});

export type InboxItem = z.infer<typeof InboxItemSchema>;

//Validador Opcional
const _checkInboxItem: PrismaInboxItem = {} as InboxItem;
const _checkInboxItem2: InboxItem = {} as PrismaInboxItem;


////// API Params

export const UserPathParamSchema = z.object({
  userId: z.string().transform((val) => Number(val)),
});

export const InboxItemIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const CreateInboxItemSchema = z.object({
  content: z.string().min(1).describe("Contenido del item"),
});

////// API Request

export const CreateInboxItemRequestSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});