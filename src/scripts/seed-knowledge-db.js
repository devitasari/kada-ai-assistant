import { supabase } from "../config/supabase.js";
import { geminiService } from "../services/gemini.service.js";
import { kadaDocuments } from "../data/kada-documents.js";
import { logger } from "../utils/logger.js";

async function seedKnowledgeDocuments() {
  logger.info("Starting knowledge base seeding...");

  for (const doc of kadaDocuments) {
    try {
      logger.info(`Generating embedding for document: ${doc.title}`);
      const embedding = await geminiService.generateEmbedding(doc.text, "RETRIEVAL_DOCUMENT");

      if (!embedding) {
        logger.error(`Failed to generate embedding for ${doc.title}. Skipping.`);
        continue;
      }

      const { error } = await supabase.from("knowledge_documents").upsert(
        {
          id: doc.id, // Gunakan ID dari kadaDocuments jika ada, atau biarkan Supabase generate
          title: doc.title,
          content: doc.text,
          source: doc.source,
          category: doc.category || "general", // Tambahkan kategori default jika tidak ada
          embedding: embedding,
          is_active: true,
        },
        { onConflict: "id" } // Update jika ID sudah ada
      );

      if (error) logger.error(`Error upserting document ${doc.title}:`, error.message);
      else logger.info(`Successfully upserted document: ${doc.title}`);
    }
    catch (error) {
       logger.error(`Unhandled error processing document ${doc.title}:`, error);
    }
  }
}

seedKnowledgeDocuments()
.then(() => {
  logger.info("Knowledge base seeding completed.");
})
.catch((error) => {
  logger.error("Error during knowledge base seeding:", error);
}); 