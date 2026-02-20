import { User, UserCreateInput, UserUpdateInput } from "../domain/user";

export interface IUserRepository {
  create(input: UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findMany(params: { limit: number; offset: number; search?: string }): Promise<{ users: User[]; total: number }>;
  update(id: string, input: UserUpdateInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export interface IRefreshTokenStore {
  set(userId: string, tokenId: string, ttlSeconds: number): Promise<void>;
  get(userId: string): Promise<string | null>;
  delete(userId: string): Promise<void>;
}
