export const aiResponseSchemaDescription = `
Return ONLY valid JSON with this exact shape:
{
  "answer": string,
  "needsHumanSupport": boolean,
  "followUpQuestion": string | null,
  "confidence": "high" | "medium" | "low",
  "sources": [
    {
      "id": string,
      "title": string,
      "source": string
    }
  ]
}
`;