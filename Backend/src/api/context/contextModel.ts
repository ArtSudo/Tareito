import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const ContextSchema = z.object({
  id: commonValidations.id,
  name: z.string().min(1).openapi({ description: "Context name (e.g. '@home', '@phone')" }),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Context = z.infer<typeof ContextSchema>;

export const CreateContextSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
  body: z.object({
    name: z.string().min(1),
  }),
});

export const GetContextByIdSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});

export const GetContextsByUserSchema = z.object({
  params: z.object({
    userId: commonValidations.id,
  }),
});
