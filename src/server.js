import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { redisClient } from "./config/redis.js";

async function startServer() {
  await redisClient.connect();
  logger.info("Redis connection established");

  app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});