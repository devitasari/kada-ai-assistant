import { supabase } from "../config/supabase.js";
import { geminiService } from "../services/gemini.service.js";

async function searchKnowledgeDocuments(query, topK = 3) {
  // 1. Generate embedding untuk query dari user
  const queryEmbedding = await geminiService.generateEmbedding(query);

  // 2. Panggil fungsi RPC di Supabase untuk Vector Similarity Search
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, // Hanya ambil yang kemiripannya > 50%
    match_count: topK,
  });

  if (error) {
    throw new Error(`Failed to fetch knowledge documents: ${error.message}`);
  }

  return data || [];
}

export const knowledgeRepository = {
  searchKnowledgeDocuments,
};