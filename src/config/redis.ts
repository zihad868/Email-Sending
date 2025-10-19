import { Redis } from "ioredis";

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  // Required by BullMQ to avoid node_redis style retries interfering with blocking commands
  // See: https://docs.bullmq.io/guide/redis
  maxRetriesPerRequest: null,
});
