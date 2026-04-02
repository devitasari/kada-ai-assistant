import { supabase } from "../config/supabase.js";

async function saveChatLog({
  sessionId,
  userMessage,
  assistantAnswer,
  detectedIntent,
  followUpQuestion,
  retrievedDocs,
  confidence,
}) {
  const { error } = await supabase.from("chat_logs").insert([
    {
      session_id: sessionId,
      user_message: userMessage,
      assistant_answer: assistantAnswer,
      detected_intent: detectedIntent,
      follow_up_question: followUpQuestion,
      retrieved_docs: retrievedDocs,
      confidence: confidence,
    },
  ]);

  if (error) {
    console.error("Failed to save chat log:", error.message);
  }
}

export const chatLogRepository = {
  saveChatLog,
};