import { redisClient } from "./config/redis.js";

async function viewRedisContent() {
  try {
    // Membuka koneksi
    await redisClient.connect();
    console.log("Successfully connected to Redis.\n");

    // Mengambil semua keys
    const keys = await redisClient.keys('*');

    if (keys.length === 0) {
      console.log("Redis is currently empty.");
    } else {
      console.log(`Found ${keys.length} keys:\n`);
      for (const key of keys) {
        const value = await redisClient.get(key);
        console.log(`KEY: ${key}`);
        console.log(`VALUE: ${value}`);
        console.log("--------------------------------------");
      }
    }
  } catch (error) {
    console.error("Error accessing Redis:", error);
  } finally {
    // Menutup koneksi agar proses Node.js bisa berhenti
    await redisClient.disconnect();
  }
}

viewRedisContent();
