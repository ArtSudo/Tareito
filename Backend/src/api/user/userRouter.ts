import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { boolean, z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, DeletUserSchema, GetUserSchema, UserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);


userRegistry.registerPath({
	method: "post",
	path: "/users/create",
	tags: ["User"],
	request: { 
		body: { 
			content: { 
				"application/json": { 
					schema: CreateUserSchema.shape.body} 
				} 
			} 
		},
	responses: createApiResponse(UserSchema, "Created"),
});

userRouter.post("/create", validateRequest(CreateUserSchema), userController.createUser);

userRegistry.registerPath({
	method:"delete",
	path: "/users/{id}",
	tags: ["User"],
	request: {params: DeletUserSchema.shape.params },
	responses: createApiResponse(z.boolean(), "Deleted"),
});

userRouter.delete("/:id",validateRequest(DeletUserSchema), userController.deleteUser);