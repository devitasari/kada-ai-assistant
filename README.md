# KADA AI Assistant
**Hybrid AI Assistant with Intent Routing, Session Memory, and Selective Retrieval**

AI-powered chatbot assistant for KADA Bootcamp that combines **structured data retrieval**, **lightweight knowledge retrieval**, **session memory**, and **LLM orchestration** to answer user questions accurately and efficiently.

This project is designed as a **hybrid AI assistant**, not a generic "ask the LLM everything" chatbot.

---

## 🚀 Overview

KADA AI Assistant helps users ask questions about:

- Available programs
- Pricing / tuition
- Batch schedules
- Registration process
- General FAQs about KADA

Instead of forcing all information through a single RAG pipeline, this project uses a **hybrid architecture**:

- **Structured questions** (programs, pricing, schedules, registration) are answered from deterministic JSON data
- **General knowledge questions** are answered through retrieval from a knowledge base
- **Conversation continuity** is maintained through Redis session history
- **Chat logs and retrieval traces** are stored in Supabase for observability

This improves:

- **Accuracy** for factual structured info
- **Lower token usage**
- **Faster response time**
- **Better maintainability**
- **Safer fallback behavior**

---

## 🧠 Why This Project Matters

Many chatbot demos send everything directly to the LLM or force all knowledge into RAG.

This project intentionally avoids that.

### Design principle:
> **Use deterministic retrieval when the answer is structured. Use LLM reasoning only when needed.**

That means:

- Pricing should not be hallucinated from text embeddings
- Schedule should not depend on semantic search if already structured
- Registration steps should be served from reliable source data
- General FAQ / broader questions can still benefit from retrieval + LLM generation

This is closer to **real AI product architecture** than a basic prompt wrapper.

---

## 🏗️ Architecture

### High-level flow

```text
User Message
   ↓
Intent Classification
   ↓
┌──────────────────────────────────────────────────────────────┐
│ If structured intent:                                       │
│  - GET_PROGRAMS                                              │
│  - GET_PRICING                                               │
│  - GET_SCHEDULE                                              │
│  - GET_REGISTRATION                                          │
│ → Retrieve from kada-data (JSON)                             │
└──────────────────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────────────────┐
│ If GENERAL_KADA                                              │
│ → Retrieve relevant docs from knowledge base                 │
│   (Supabase primary, local fallback if configured)           │
└──────────────────────────────────────────────────────────────┘
   ↓
Load session history from Redis
   ↓
Build LLM prompt + tool context
   ↓
Gemini generates structured JSON response
   ↓
Persist chat logs to Supabase
   ↓
Return response to client
```
---

## Example Request / Response

### Request
```json
{
  "message": "Biaya fullstack berapa?",
  "sessionId": "abc123"
}
```

### Response
```json
{
  "answer": "Biaya program Fullstack Web Development adalah Rp 8.500.000.",
  "needsHumanSupport": false,
  "followUpQuestion": "Mau saya jelaskan jadwal batch berikutnya juga?",
  "confidence": "high"
}
```

---

## Running Locally

- git clone https://github.com/devitasari/kada-ai-assistant.git
- cd kada-ai-assistant
- npm install
- create .env file based on .env.example
- npm run dev

---

## 📂 Project Structure
```text
kada-ai-assistant/
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── ai.js
    │   ├── env.js
    │   └── gemini-tools.js
    │   ├── redis.js
    │   └── supabase.js
    ├── controllers/
    │   └── chat.controller.js
    ├── data/
    │   └── kada-data.js
    │   ├── kada-document.js
    ├── prompts/
    │   └── system.prompt.js
    │   └── tool-routing.prompt.js
    ├── repositories/
    │   ├── chat-log.repository.js
    │   └── knowledge.repository.js
    ├── routes/
    │   └── chat.routes.js
    ├── scripts/
    │   └── view-redis.js
    ├── services/
    │   ├── chat.service.js
    │   ├── gemini.service.js
    │   ├── history.service.js
    │   ├── retrieval.service.js
    │   ├── tool-orchestrator.service.js
    │   ├── tool-executor.service.js
    │   └── function-calling.service.js
    ├── tools/
    │   ├── getPricing.tool.js
    │   ├── getProgram.tool.js
    │   ├── getRegistration.tool.js
    │   └── getSchedule.tool.js
    └── utils/
    |   ├── ai-response-schema.js
    |   ├── errors.js
    |   ├── json.js
    |   ├── response.js
    |   ├── retry.js
    |   └── logger.js
    └── validators/
        └── chat.validator.js
```