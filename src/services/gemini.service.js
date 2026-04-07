import { ai } from "../config/ai.js";
import { env } from "../config/env.js";
import { withRetry } from "../utils/retry.js";

async function generateText(prompt, modelOverride = null) {
  const response = await withRetry(
    async () => {
      return await ai.models.generateContent({
        model: modelOverride || env.geminiModel,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    },
    {
      retries: 2,
      delayMs: 800,
    }
  );

  return response.text?.trim() || "";
}

async function generateEmbedding(text, taskType = "RETRIEVAL_QUERY") {
  const response = await withRetry(async () => {
    return await ai.models.embedContent({
      model: "models/gemini-embedding-001",
      contents: [{ parts: [{ text }] }],
      config: { taskType },
    });
  });

  if (!response || !response.embeddings || !response.embeddings[0]) {
    throw new Error("Failed to generate embedding");
  }

  return response.embeddings[0].values;
}

export const geminiService = {
  generateText,
  generateEmbedding,
};