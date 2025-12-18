import { prisma } from "../../database/conn";
import { hashPassword } from "../../helpers/hash";
import { ISignup } from "../../types/auth.type";
import Logger from "../Logger";

type UserProfileUpdateInput = {
	username: string;
	email: string;
	profile_pic: string;
	bio: string;
	cooking_skill_level: string;
};

class User {
	private readonly logger = new Logger().logger;
	public async findExistingUser(username: string) {
		try {
			return prisma.user.findFirst({
				where: {
					username,
					is_deleted: false
				}
			})
		} catch (error) {
			this.logger.error("User not found")
			return null
		}
	}

	public async createUser(user: ISignup) {
		try {
			const hashed = await hashPassword(user.password)
			if (!hashed) {
				this.logger.error("Password hashing failed")
				return null
			}
			user.password = hashed
			return prisma.user.create({
				data: user
			})
		} catch (error) {
			this.logger.error("User creation failed")
			return null
		}
	}

	// public async findUserById(id: string) {
	// 	try {
	// 		return prisma.user.findUnique({
	// 			where: {
	// 				id
	// 			}
	// 		})
	// 	} catch (error) {
	// 		this.logger.error("User not found")
	// 		return null
	// 	}
	// }

	public async findUserProfileById(id: string) {
		try {
			return prisma.user.findFirst({
				where: { id, is_deleted: false },
				select: {
					id: true,
					username: true,
					email: true,
					profile_pic: true,
					bio: true,
					cooking_skill_level: true,
					created_at: true,
					updated_at: true
				}
			})
		} catch (error) {
			this.logger.error("User not found")
			return null
		}
	}

	public async updateUserProfileById(
		id: string,
		updates: UserProfileUpdateInput
	) {
		try {
			const existing = await prisma.user.findFirst({
				where: { id, is_deleted: false }
			})
			if (!existing) {
				return null
			}

			return prisma.user.update({
				where: { id },
				data: updates,
				select: {
					id: true,
					username: true,
					email: true,
					profile_pic: true,
					bio: true,
					cooking_skill_level: true,
					created_at: true,
					updated_at: true
				}
			})
		} catch (error) {
			this.logger.error("User update failed")
			return null
		}
	}

		public async softDeleteUserById(id: string) {
		try {
			const existing = await prisma.user.findFirst({
				where: { id, is_deleted: false }
			})
			if (!existing) {
				return null
			}

			return prisma.user.update({
				where: { id },
				data: { is_deleted: true },
				select: {
					id: true,
					username: true,
					email: true,
					profile_pic: true,
					bio: true,
					cooking_skill_level: true,
					created_at: true,
					updated_at: true
				}
			})
		} catch (error) {
			this.logger.error("User delete failed")
			return null
		}
	}

}

export default User;
