import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const ProjectSchema = z.object({
  id: commonValidations.id,
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string().default("active"),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = z.object({
  params: z.object({ userId: commonValidations.id }),
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  }),
});

export const GetProjectByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetProjectsByUserSchema = z.object({
  params: z.object({ userId: commonValidations.id }),
});
