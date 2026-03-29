import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash-001",
};

if (!env.geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}