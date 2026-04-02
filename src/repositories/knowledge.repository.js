import { supabase } from "../config/supabase.js";

function scoreDocument(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const content = text.toLowerCase();

  let score = 0;
  for (const word of queryWords) {
    if (content.includes(word)) score += 1;
  }

  return score;
}

async function searchKnowledgeDocuments(query, topK = 3) {
  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("id, title, category, content, source, tags")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to fetch knowledge documents: ${error.message}`);
  }

  const scored = (data || [])
    .map((doc) => {
      const combinedText = `${doc.title}\n${doc.content}\n${(doc.tags || []).join(" ")}`;
      return {
        ...doc,
        score: scoreDocument(query, combinedText),
      };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export const knowledgeRepository = {
  searchKnowledgeDocuments,
};