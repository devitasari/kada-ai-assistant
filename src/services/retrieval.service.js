import { kadaDocuments } from "../data/kada-documents.js";

function scoreDocument(query, text) {
  const words = query.toLowerCase().split(/\s+/);
  const content = text.toLowerCase();

  let score = 0;

  for (const word of words) {
    if (content.includes(word)) score++;
  }

  return score;
}

function retrieveRelevantDocs(query, topK = 3) {
  const scored = kadaDocuments
    .map((doc) => ({
      ...doc,
      score: scoreDocument(query, doc.text),
    }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export const retrievalService = {
  retrieveRelevantDocs,
};