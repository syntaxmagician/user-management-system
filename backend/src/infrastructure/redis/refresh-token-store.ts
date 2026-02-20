import { redis } from "./redis-client";
import type { IRefreshTokenStore } from "../../domain/repositories";

const PREFIX = "refresh:";

export const refreshTokenStore: IRefreshTokenStore = {
  async set(userId: string, tokenId: string, ttlSeconds: number): Promise<void> {
    await redis.setex(`${PREFIX}${userId}`, ttlSeconds, tokenId);
  },
  async get(userId: string): Promise<string | null> {
    return redis.get(`${PREFIX}${userId}`);
  },
  async delete(userId: string): Promise<void> {
    await redis.del(`${PREFIX}${userId}`);
  },
};
