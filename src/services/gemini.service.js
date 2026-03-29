import { ai } from "../config/ai.js";
import { env } from "../config/env.js";

async function generateText(prompt) {
  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: prompt,
  });

  return response.text?.trim() || "";
}

export const geminiService = {
  generateText,
};