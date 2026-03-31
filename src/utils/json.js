export function safeJsonParse(text) {
  try {
    if (!text) return null;

    // Mencari konten di dalam block ```json ... ``` atau ``` ... ```
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanedText = match ? match[1] : text;

    return JSON.parse(cleanedText.trim());
  } catch {
    return null;
  }
}