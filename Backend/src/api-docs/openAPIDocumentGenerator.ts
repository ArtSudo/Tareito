import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { inboxRegistry  } from "@/api/inbox/inboxRouter";
import { nextActionRegistry } from "@/api/nextAction/nextActionRouter";
import { projectRegistry } from "@/api/project/projectRouter"
import { contextRegistry } from "@/api/context/contextRouter"
import { botRegistry } from "@/bot/botRouter";
export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry,inboxRegistry,nextActionRegistry,projectRegistry,contextRegistry,botRegistry]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}
