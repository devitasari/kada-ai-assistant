import { knowledgeRepository } from "../repositories/knowledge.repository.js";

export const retrievalService = {
  /**
   * Mengambil dokumen relevan dari Supabase melalui knowledgeRepository.
   * @param {string} query - Pertanyaan dari pengguna.
   * @param {number} limit - Jumlah maksimal dokumen yang ingin diambil.
   * @returns {Promise<Array>} Array berisi dokumen yang relevan (formatted).
   */
  async retrieveRelevantDocs(query, limit = 3) {
    try {
      const docs = await knowledgeRepository.searchKnowledgeDocuments(query, limit);

      return docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        source: doc.source,
        category: doc.category,
        text: doc.content,
      }));
    } catch (error) {
      console.error("Error in retrievalService.retrieveRelevantDocs:", error);
      return [];
    }
  },
};