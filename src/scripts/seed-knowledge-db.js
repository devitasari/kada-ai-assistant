import { supabase } from "../config/supabase.js";
import { geminiService } from "../services/gemini.service.js";
import { kadaDocuments } from "../data/kada-documents.js";
import { logger } from "../utils/logger.js";

/**
 * Membagi teks menjadi potongan-potongan kecil dengan overlap
 */
function chunkText(text, size = 1000, overlap = 200) {
  const chunks = [];
  if (!text) return chunks;
  
  for (let i = 0; i < text.length; i += (size - overlap)) {
    chunks.push(text.substring(i, i + size));
    if (i + size >= text.length) break;
  }
  return chunks;
}

async function seedKnowledgeDocuments() {
  logger.info("Starting knowledge base seeding...");

  for (const doc of kadaDocuments) {
    try {
      logger.info(`Processing document: ${doc.title}`);
      
      // Membagi dokumen menjadi beberapa chunk
      const chunks = chunkText(doc.text);
      logger.info(`Split into ${chunks.length} chunks.`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        logger.info(`Generating embedding for chunk ${i + 1}/${chunks.length}`);
        
        const embedding = await geminiService.generateEmbedding(chunk, "RETRIEVAL_DOCUMENT");

        if (!embedding) {
          logger.error(`Failed to generate embedding for chunk ${i} of ${doc.title}. Skipping.`);
          continue;
        }

        const { error } = await supabase.from("knowledge_documents").upsert(
          {
            // Gunakan ID unik untuk setiap chunk agar tidak saling menimpa
            title: chunks.length > 1 ? `${doc.title} (Part ${i + 1})` : doc.title,
            content: chunk,
            source: doc.source,
            category: doc.category || "general",
            embedding: embedding,
            is_active: true,
          }
        );

        if (error) logger.error(`Error upserting chunk ${i} of ${doc.title}:`, error.message);
        else logger.info(`Successfully upserted chunk ${i + 1}`);
      }
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