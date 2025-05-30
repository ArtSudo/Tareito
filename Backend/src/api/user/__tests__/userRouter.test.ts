import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { User } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";
import { prisma } from "@/common/utils/prisma";

describe("userRouter", () => {
	const testUsers = [
		{ name: "userRouter1", email: "userRouter1@test.com", password: "12345678" },
		{ name: "userRouter2", email: "userRouter2@test.com", password: "12345678" },
	];

	let createdIds: number[] = [];

	beforeAll(async ()=>{    
    	//await prisma.user.deleteMany();
	});

	afterAll(async () => {
		//await prisma.user.deleteMany(); // limpia base de datos después
		//await prisma.$disconnect();
	});

	it("should create users", async () => {
		for (const user of testUsers) {
			const response = await request(app)
				.post("/users/create")
				.send(user)
				.set("Content-Type", "application/json");

			const body: ServiceResponse<User> = response.body;
			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(body.success).toBeTruthy();
			expect(body.responseObject?.email).toBe(user.email);

			createdIds.push(body.responseObject.id);
		}
	});



	it("should get all created users", async () => {
		const response = await request(app).get("/users");
		const body: ServiceResponse<User[]> = response.body;

		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(body.success).toBeTruthy();
		expect(body.responseObject.length).toBeGreaterThanOrEqual(testUsers.length);
	});

	it("should get one user by ID", async () => {
		const id = createdIds[0];
		const response = await request(app).get(`/users/${id}`);
		const body: ServiceResponse<User> = response.body;

		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(body.success).toBeTruthy();
		expect(body.responseObject?.id).toBe(id);
	});

	it("should delete all users", async () => {
		for (const id of createdIds) {
			const response = await request(app).delete(`/users/${id}`);
			const body: ServiceResponse<boolean> = response.body;

			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(body.success).toBeTruthy();
			expect(body.responseObject).toBe(true);
	 }
	});

	it("should return not found after deletion", async () => {
		for (const id of createdIds) {
			const response = await request(app).get(`/users/${id}`);
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
		}
	});

});


function compareUsers(mockUser: User, responseUser: User) {
	if (!mockUser || !responseUser) {
		throw new Error("Invalid test data: mockUser or responseUser is undefined");
	}

	expect(responseUser.id).toEqual(mockUser.id);
	expect(responseUser.name).toEqual(mockUser.name);
	expect(responseUser.email).toEqual(mockUser.email);
	expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
	expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
}
