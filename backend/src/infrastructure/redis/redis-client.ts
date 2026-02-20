import Redis from "ioredis";
import { config } from "../../shared/config";

export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

redis.on("error", (err) => {
  console.error("[Redis]", err.message);
});
