import { GoogleGenAI } from "@google/genai";
import { env } from "./env.js";

export const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});