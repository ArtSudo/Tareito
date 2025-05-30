import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { StatusCodes } from "http-status-codes";

import { prisma } from "@/common/utils/prisma";
import { UserService } from "@/api/user/userService";

let userService: UserService;

const testUsers = [
	{ name: "userService1", email: "userService1@example.com", password: "12345678" },
	{ name: "userService2", email: "userService2@example.com", password: "12345678" },
];

const createdUserIds: number[] = [];

describe("UserService", () => {
	beforeAll(async () => {
		userService = new UserService();
		//await prisma.user.deleteMany(); // limpia base de datos antes
	});

	afterAll(async () => {
		//await prisma.user.deleteMany(); // limpia base de datos después
		//await prisma.$disconnect();
	});

	it("should create multiple users", async () => {
		for (const u of testUsers) {
			const res = await userService.create(u);
			expect(res.statusCode).toBe(StatusCodes.CREATED);
			expect(res.success).toBe(true);
			expect(res.responseObject?.email).toBe(u.email);
			if (res.responseObject?.id) createdUserIds.push(res.responseObject.id);
		}
	});

	it("should retrieve all users", async () => {
		const res = await userService.findAll();
		expect(res.statusCode).toBe(StatusCodes.OK);
		expect(res.success).toBe(true);
		expect(res.responseObject?.length).toBeGreaterThanOrEqual(2);
	});

	it("should retrieve a user by ID", async () => {
		const all = await userService.findAll();
		const user = all.responseObject?.[0];
		expect(user).toBeDefined();

		const res = await userService.findById(user!.id);
		expect(res.statusCode).toBe(StatusCodes.OK);
		expect(res.responseObject?.id).toBe(user!.id);
	});

	it("should delete all test-created users", async () => {
		for (const id of createdUserIds) {
			const res = await userService.delete(id);
			expect(res.statusCode).toBe(StatusCodes.OK);
			expect(res.responseObject).toBe(true);
		}

		const res = await userService.findAll();
		const remaining = res.responseObject?.filter((u: any) => createdUserIds.includes(u.id));
		expect(remaining?.length ?? 0).toBe(0);
	});
});
