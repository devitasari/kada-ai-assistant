# KADA AI Assistant

**KADA AI Assistant** is an AI-powered customer support backend for KADA Bootcamp, built with a **hybrid Retrieval-Augmented Generation (RAG)** architecture using **Gemini API**, **Supabase vector search**, and **intent-based orchestration**.

It is designed to answer questions about **programs, schedules, pricing, registration, and general KADA information** with grounded, structured, and context-aware responses.

---

## 🚀 Overview

This project is not a generic chatbot.

It is a **production-oriented AI backend** that combines:

- **Intent classification**
- **Structured tool-based retrieval**
- **Semantic vector retrieval (RAG)**
- **Prompt grounding**
- **Multi-turn conversation memory**
- **Structured JSON output**
- **Fallback and human escalation logic**

Instead of sending every user message directly to the LLM, the system first determines the best response strategy:

- **Deterministic retrieval** for business-specific intents such as pricing, schedules, and registration
- **Semantic vector retrieval** for broader informational questions using a Supabase-powered knowledge base

This results in a more accurate, efficient, and reliable customer support assistant.

---

## ✨ Key Features

### 1) Intent Classification
The assistant classifies user messages into domain-specific intents:

- `GET_PROGRAMS`
- `GET_SCHEDULE`
- `GET_PRICING`
- `GET_REGISTRATION`
- `GENERAL_KADA`
- `OUT_OF_SCOPE`

This enables the backend to decide whether to:
- use structured data retrieval,
- perform semantic document retrieval,
- or safely fall back when the query is unsupported.

---

### 2) Hybrid / Selective RAG Architecture
This project uses a **hybrid RAG** strategy:

- **Structured retrieval** for deterministic business intents  
  (e.g. pricing, schedules, registration)
- **Semantic retrieval** for broader knowledge questions  
  (e.g. general KADA information)

This architecture is more practical than sending all queries through vector search because it:
- reduces unnecessary retrieval calls,
- improves latency and cost efficiency,
- keeps deterministic answers more reliable,
- and still benefits from semantic search when natural-language knowledge lookup is needed.

---

### 3) Semantic Retrieval with Supabase Vector Search
For general knowledge queries, the assistant performs **embedding-based retrieval** using a **Supabase vector database**.

Typical flow:
1. User asks a question
2. Relevant documents are retrieved through **vector similarity search**
3. Top-matching context is injected into the prompt
4. Gemini generates a grounded answer based on retrieved knowledge

This reduces hallucination and improves domain relevance.

---

### 4) Prompt Grounding
Before calling the LLM, the system assembles a grounded prompt using:

- system instructions,
- conversation history,
- detected intent,
- structured tool context,
- and retrieved semantic knowledge.

This makes the response more aligned with real KADA information instead of relying only on the model’s internal knowledge.

---

### 5) Multi-Turn Conversation Support
The assistant preserves **session history** so follow-up questions remain contextual.

Examples:
- “How much is the Fullstack program?”
- “What about the next batch?”
- “Yes, explain more.”

This makes the interaction feel natural and stateful.

---

## Structured JSON Request Response Contract

Request

```json
{
  "sessionId": "user-0",
  "message": "Berapa biaya investasinya?"
}
```

The LLM is guided to return a predictable response schema such as:

```json
{
  "answer": "Biaya fullstack Rp 8.500.000",
  "needsHumanSupport": false,
  "followUpQuestion": "Mau saya jelaskan jadwal batch berikutnya juga?",
  "confidence": "high",
  "sources": []
}
```
---

## 🧠 High Level Flow

```text
User Message
   ↓
Load Session History
   ↓
Intent Classification / Tool Orchestration
   ↓
┌──────────────────────────────────────────────┐
│ If deterministic business intent            │
│ → Structured retrieval / tool-based context │
└──────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────┐
│ If GENERAL_KADA                             │
│ → Semantic retrieval from Supabase vector DB│
└──────────────────────────────────────────────┘
   ↓
Prompt Assembly
  - System Prompt
  - History
  - Intent
  - Tool Context
  - Retrieved Knowledge
   ↓
Gemini Response Generation
   ↓
Structured JSON Parsing
   ↓
Fallback Handling
   ↓
Source Injection
   ↓
Persist History + Chat Logs
   ↓
API Response
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

## 🛠️ Tech Stack
- Node.js / JavaScript
- Gemini API
- Supabase
- Vector embeddings + semantic retrieval
- Prompt engineering
- Intent classification / tool orchestration
- Conversation history management
- Structured JSON output parsing
- Chat logging / observability