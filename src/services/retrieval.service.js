import { knowledgeRepository } from "../repositories/knowledge.repository.js";

async function retrieveRelevantDocs(query, topK = 3) {
  const docs = await knowledgeRepository.searchKnowledgeDocuments(query, topK);

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    source: doc.source,
    category: doc.category,
    text: doc.content,
  }));
}

export const retrievalService = {
  retrieveRelevantDocs,
};