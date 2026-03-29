import { historyService } from "./history.service.js";
import { toolOrchestratorService } from "./tool-orchestrator.service.js";
import { geminiService } from "./gemini.service.js";
import { buildSystemPrompt } from "../prompts/system.prompt.js";

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

Now generate the final response:
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

  const reply = await geminiService.generateText(finalPrompt);

  console.log(finalPrompt, reply)

  historyService.addMessage(sessionId, "user", message);
  historyService.addMessage(sessionId, "assistant", reply);

  console.log(historyService.getSessionHistory(sessionId))

  return {
    sessionId,
    intent,
    reply,
    toolUsed: toolData ? Object.keys(toolData) : [],
  };
}

export const chatService = {
  processMessage,
};