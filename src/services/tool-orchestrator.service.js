import { geminiService } from "./gemini.service.js";
import { buildToolRoutingPrompt } from "../prompts/tool-routing.prompt.js";
import { getPrograms } from "../tools/getPrograms.tool.js";
import { getSchedule } from "../tools/getSchedule.tool.js";
import { getPricing } from "../tools/getPricing.tool.js";
import { getRegistration } from "../tools/getRegistration.tool.js";

async function detectIntent(userMessage) {
  const prompt = buildToolRoutingPrompt(userMessage);
  const label = await geminiService.generateText(prompt);

  return label.toUpperCase().trim();
}

async function resolveTools(userMessage) {
  const intent = await detectIntent(userMessage);

  switch (intent) {
    case "GET_PROGRAMS":
      return {
        intent,
        toolData: {
          programs: getPrograms(),
        },
      };

    case "GET_SCHEDULE":
      return {
        intent,
        toolData: {
          schedule: getSchedule(),
        },
      };

    case "GET_PRICING":
      return {
        intent,
        toolData: {
          pricing: getPricing(),
        },
      };

    case "GET_REGISTRATION":
      return {
        intent,
        toolData: {
          registration: getRegistration(),
        },
      };

    case "OUT_OF_SCOPE":
      return {
        intent,
        toolData: null,
      };

    case "GENERAL_KADA":
    default:
      return {
        intent: "GENERAL_KADA",
        toolData: null,
      };
  }
}

export const toolOrchestratorService = {
  resolveTools,
};