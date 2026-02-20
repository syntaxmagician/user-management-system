import { userRepository } from "../infrastructure/database/user-repository";
import type { UserPublic, UserCreateInput, UserUpdateInput } from "../domain/user";
import { toPublicUser } from "../domain/user";
import { AppError, ErrorCodes } from "../shared/errors";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const userService = {
  async list(params: { page?: number; limit?: number; search?: string }): Promise<{
    users: UserPublic[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, params.limit ?? DEFAULT_LIMIT));
    const offset = (page - 1) * limit;
    const { users, total } = await userRepository.findMany({
      limit,
      offset,
      search: params.search,
    });
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      users: users.map(toPublicUser),
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id: string): Promise<UserPublic | null> {
    const user = await userRepository.findById(id);
    return user ? toPublicUser(user) : null;
  },

  async create(input: UserCreateInput): Promise<UserPublic> {
    const email = input.email.trim().toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(ErrorCodes.CONFLICT, "Email sudah terdaftar", 409);
    }
    const user = await userRepository.create({
      email,
      name: input.name.trim(),
      password: input.password,
    });
    return toPublicUser(user);
  },

  async update(id: string, input: UserUpdateInput): Promise<UserPublic | null> {
    if (input.email !== undefined) {
      const existing = await userRepository.findByEmail(input.email.trim().toLowerCase());
      if (existing && existing.id !== id) {
        throw new AppError(ErrorCodes.CONFLICT, "Email sudah digunakan user lain", 409);
      }
    }
    const user = await userRepository.update(id, input);
    return user ? toPublicUser(user) : null;
  },

  async delete(id: string): Promise<boolean> {
    return userRepository.delete(id);
  },
};
