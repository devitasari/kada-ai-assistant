import { historyService } from "./history.service.js";
import { toolOrchestratorService } from "./tool-orchestrator.service.js";
import { geminiService } from "./gemini.service.js";
import { buildSystemPrompt } from "../prompts/system.prompt.js";
import { aiResponseSchemaDescription } from "../utils/ai-response-schema.js";
import { safeJsonParse } from "../utils/json.js";
import { response } from "express";

function formatHistory(history) {
  if (!history.length) return "No previous conversation.";

  return history
    .map((item) => `${item.role.toUpperCase()}: ${item.text}`)
    .join("\n");
}

function buildFinalPrompt({ systemPrompt, history, userMessage, toolContext, intent }) {
  return `
${systemPrompt}

Conversation history:
${history}

Detected intent:
${intent}

Tool context:
${toolContext ? JSON.stringify(toolContext, null, 2) : "No tool data"}

Current user message:
"${userMessage}"

Instructions:
- Answer naturally as KADA AI Assistant.
- Use tool context if available.
- Do not invent facts.
- If out of scope, politely say you only handle KADA-related questions.

${aiResponseSchemaDescription}

Current user message:
"${userMessage}"
  `.trim();
}

async function processMessage({ sessionId, message }) {
  const history = historyService.getSessionHistory(sessionId);

  const { intent, toolData } = await toolOrchestratorService.resolveTools(message);

  const finalPrompt = buildFinalPrompt({
    systemPrompt: buildSystemPrompt(),
    history: formatHistory(history),
    userMessage: message,
    toolContext: toolData,
    intent,
  });

  let modelText;
  let structured;

  try {
    modelText = await geminiService.generateText(finalPrompt);
    structured = safeJsonParse(modelText);
  } catch (error) {
    console.log(error);
    structured = null;
  }

  if (!structured) {
    structured = {
      answer: "Sorry, AI system currently unavailable. Please try again later or contact KADA admin.",
      needsHumanSupport: true,
      followupQuestion: null,
      confidence: "low"
    }
  }

  historyService.addMessage(sessionId, "user", message);
  historyService.addMessage(sessionId, "assistant", structured.answer);

  return {
    sessionId,
    intent,
    response: structured,
    toolUsed: toolData ? Object.keys(toolData) : [],
  };
}

async function resetSession(sessionId) {
  historyService.clearSession(sessionId);
}

export const chatService = {
  processMessage,
  resetSession,
};