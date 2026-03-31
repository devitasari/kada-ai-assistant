import { ai } from "../config/ai.js";
import { env } from "../config/env.js";
import { geminiTools } from "../config/gemini-tools.js";
import { executeTool } from "./tool-executor.service.js";
import { buildSystemPrompt } from "../prompts/system.prompt.js";

async function generateWithFunctionCalling(userMessage, historyText) {
  const initialPrompt = `
${buildSystemPrompt()}

Conversation history:
${historyText}

User message:
"${userMessage}"

If needed, call the appropriate function to answer accurately.
  `.trim();

  const firstResponse = await ai.models.generateContent({
    model: env.geminiModel,
    contents: initialPrompt,
    config: {
      tools: geminiTools,
    },
  });

  // NOTE:
  // exact SDK parsing may differ by version
  const functionCall = firstResponse.functionCalls?.[0];

  if (!functionCall) {
    return {
      intent: "GENERAL_KADA",
      toolData: null,
    };
  }

  const toolResult = await executeTool(functionCall.name);

  // Transformasi nama fungsi (camelCase) ke Format Intent (UPPER_SNAKE_CASE)
  // Contoh: getSchedule -> schedule (data key) & GET_SCHEDULE (intent)
  const dataKey = functionCall.name.replace(/^get/, "").toLowerCase();
  const intent = functionCall.name.replace(/([A-Z])/g, "_$1").toUpperCase();

  return {
    intent,
    toolData: {
      [dataKey]: toolResult,
    },
  };
}

export const functionCallingService = {
  generateWithFunctionCalling,
};