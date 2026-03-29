export function buildToolRoutingPrompt(userMessage) {
  return `
Classify the user's intent into one of these exact labels:
- GET_PROGRAMS
- GET_SCHEDULE
- GET_PRICING
- GET_REGISTRATION
- GENERAL_KADA
- OUT_OF_SCOPE

Return ONLY the label. No explanation.

User message:
"${userMessage}"
  `.trim();
}