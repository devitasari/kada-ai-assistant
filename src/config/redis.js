import { createClient } from "redis";
import { logger } from "../utils/logger.js";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  logger.info("Redis client is attempting to connect...");
});

redisClient.on("ready", () => {
  logger.info("Redis client is ready and connected");
});