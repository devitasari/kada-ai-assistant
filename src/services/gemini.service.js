import { ai } from "../config/ai.js";
import { env } from "../config/env.js";
import { withRetry } from "../utils/retry.js";

async function generateText(prompt) {
  const response = await withRetry(
    async () => {
      return await ai.models.generateContent({
        model: env.geminiModel,
        contents: prompt,
      });
    },
    {
      retries: 2,
      delayMs: 800,
    }
  );

  return response.text?.trim() || "";
}

export const geminiService = {
  generateText,
};