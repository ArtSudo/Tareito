import type { User } from "@/api/user/userModel";
import { prisma } from "@/common/utils/prisma";

export class UserRepository {
	async findAllAsync(): Promise<User[]> {
		return prisma.user.findMany({
			orderBy: { id: "asc" },
		});
	}

	async findByIdAsync(id: number): Promise<User | null> {
		return prisma.user.findUnique({
			where: { id },
		});
	}

	async create(dato: User): Promise<User>{
		return prisma.user.create({
			data: {
				name: dato.name,
				email: dato.email,
				password: dato.password,
				// add other required fields if needed
			}
		});
	}
}
