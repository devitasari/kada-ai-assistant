import { historyService } from "./history.service.js";
import { toolOrchestratorService } from "./tool-orchestrator.service.js";
import { geminiService } from "./gemini.service.js";
import { buildSystemPrompt } from "../prompts/system.prompt.js";
import { aiResponseSchemaDescription } from "../utils/ai-response-schema.js";
import { safeJsonParse } from "../utils/json.js";
import { functionCallingService } from "./function-calling.service.js";
import { logger } from "../utils/logger.js";
import { retrievalService } from "./retrieval.service.js";
import { env } from "../config/env.js";

function formatHistory(history) {
  if (!history.length) return "No previous conversation.";

  return history
    .map((item) => `${item.role.toUpperCase()}: ${item.text}`)
    .join("\n");
}

function buildFinalPrompt({ systemPrompt, history, userMessage, toolContext, intent, retrievedDocs }) {
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

    Retrieved knowledge:
    ${retrievedDocs.length ? JSON.stringify(retrievedDocs, null, 2) : "No retrieved documents"}

    ${aiResponseSchemaDescription}
  `.trim();

}

async function processMessage({ sessionId, message }) {
  const history = await historyService.getSessionHistory(sessionId);

  const { intent, toolData } = env.useNativeFunctionCalling ? await functionCallingService.generateWithFunctionCalling(message, formatHistory(history)) : await toolOrchestratorService.resolveTools(message);

  // Optimasi: Jika Out of Scope, tidak perlu memanggil Gemini lagi
  if (intent === "OUT_OF_SCOPE") {
    const structured = {
      answer: "I'm sorry, as the KADA AI assistant, I can only help with questions regarding KADA's programs, schedules, pricing, and registration.",
      needsHumanSupport: false,
      followUpQuestion: "Is there anything else related to KADA you'd like to ask?",
      confidence: "high"
    };

    const assistantMessage = `${structured.answer} ${structured.followUpQuestion}`;
    
    await historyService.addMessage(sessionId, "user", message);
    await historyService.addMessage(sessionId, "assistant", assistantMessage);
    
    return { sessionId, intent, response: structured, toolUsed: [] };
  }

  const retrievedDocs = retrievalService.retrieveRelevantDocs(message);

  const finalPrompt = buildFinalPrompt({
    systemPrompt: buildSystemPrompt(),
    history: formatHistory(history),
    userMessage: message,
    toolContext: toolData,
    retrievedDocs,
    intent,
  });

  let modelText;
  let structured;

  try {
    modelText = await geminiService.generateText(finalPrompt);
    structured = safeJsonParse(modelText);
  } catch (error) {
    logger.error(error)
    structured = null;
  }

  if (!structured) {
    structured = {
      answer: "Sorry, AI system currently unavailable. Please try again later or contact KADA admin.",
      needsHumanSupport: true,
      followUpQuestion: null,
      confidence: "low"
    }
  }

  if (!structured.sources) {
    structured.sources = retrievedDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      source: doc.source,
    }));
  }

  const assistantMessage = structured.followUpQuestion 
    ? `${structured.answer} ${structured.followUpQuestion}`
    : structured.answer;

  await historyService.addMessage(sessionId, "user", message);
  await historyService.addMessage(sessionId, "assistant", assistantMessage);

  return {
    sessionId,
    intent,
    response: structured,
    toolUsed: toolData ? Object.keys(toolData) : [],
  };
}

async function resetSession(sessionId) {
  await historyService.clearSession(sessionId);
}

export const chatService = {
  processMessage,
  resetSession,
};