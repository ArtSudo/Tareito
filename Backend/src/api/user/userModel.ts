import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";
import { User as PrismaUser } from "@/generated/prisma";

extendZodWithOpenApi(z);


export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	password: z.string({description: 'User password - must be at least 8 characters',}).min(8),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
//Validador Opcional
const _checkInboxItem: PrismaUser = {} as User;
const _checkInboxItem2: User = {} as PrismaUser;

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
