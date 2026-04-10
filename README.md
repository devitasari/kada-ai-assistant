# KADA AI Assistant

**KADA AI Assistant** is a production-grade AI backend designed to power intelligent customer support for the KADA Bootcamp.  
It delivers **accurate, structured, and context-aware responses** using a **hybrid Retrieval-Augmented Generation (RAG) architecture, intent-based routing, and Gemini LLM integration**.

Built with scalability and reliability in mind, this system goes beyond a typical chatbot by combining **deterministic business logic + semantic AI retrieval**.

---

## 🚀 Product Overview

KADA AI Assistant acts as an **AI support layer for bootcamp operations**, handling inquiries about:

- Programs & curriculum
- Pricing & payments
- Schedules & batches
- Registration flow
- General institutional information

Instead of relying solely on an LLM, the system intelligently decides how to respond using a **multi-layer reasoning pipeline**:

- Structured business logic for precise answers
- Vector-based retrieval for contextual knowledge
- LLM generation only when needed

This design significantly improves:
- Answer accuracy
- Response consistency
- Cost efficiency
- Hallucination control

---

## 🧠 Core Architecture Highlights

### 1. Intent-Based Routing System

The assistant first classifies every user query into structured intents:

- `GET_PROGRAMS`
- `GET_SCHEDULE`
- `GET_PRICING`
- `GET_REGISTRATION`
- `GENERAL_KADA`
- `OUT_OF_SCOPE`

This enables the system to **avoid unnecessary LLM calls** and route queries to the most reliable execution path.

---

### 2. Hybrid RAG (Retrieval-Augmented Generation)

A key engineering highlight of this project is its **hybrid RAG architecture**:

- **Structured Retrieval (Deterministic Path)**  
  Used for business-critical queries like pricing, schedule, and registration.

- **Semantic Retrieval (Vector Search via Supabase)**  
  Used for natural language questions requiring contextual understanding.

This hybrid approach ensures:
- Higher accuracy for business data
- Lower hallucination risk
- Better performance and cost optimization
- Cleaner separation between logic and knowledge retrieval

---

### 3. Vector Search with Supabase

For knowledge-based queries, the system uses **Supabase vector embeddings** to perform semantic similarity search.

Flow:
1. User query is embedded
2. Similar documents are retrieved from vector DB
3. Top results are injected into prompt context
4. Gemini generates grounded responses

This ensures answers are **anchored in real KADA knowledge base content**.

---

### 4. LLM Prompt Grounding Strategy

Instead of sending raw user input to the model, the system builds a **structured grounded prompt** containing:

- Intent classification result
- Conversation history
- Retrieved knowledge (if any)
- Tool-based business context
- System-level constraints

This reduces hallucination and enforces **consistent, structured outputs**.

---

### 5. Multi-Turn Conversation Memory

The assistant maintains session-based history to support natural follow-ups such as:

- “How much is the fullstack program?”
- “What about the next batch?”
- “Yes, explain more”

This enables a **stateful conversational experience** instead of stateless Q&A.

---

## 📦 Structured Output Contract

All responses follow a strict JSON schema to ensure backend reliability and frontend predictability:

```json
{
  "answer": "Biaya fullstack Rp 8.500.000",
  "needsHumanSupport": false,
  "followUpQuestion": "Mau saya jelaskan jadwal batch berikutnya juga?",
  "confidence": "high",
  "sources": []
}
```
This allows:

Frontend UI control
Escalation to human support
Confidence-based decision making
Safe production integration

---
## 🧠 End to End System Flow

```text
User Message
   ↓
Session & History Loader
   ↓
Intent Classification
   ↓
Routing Layer
   ├─ Structured Business Tools (Pricing/Schedule/Registration)
   ├─ Vector Retrieval (Supabase RAG)
   └─ Out-of-scope Handling
   ↓
Prompt Assembly (Grounded Context)
   ↓
Gemini LLM Generation
   ↓
Structured JSON Parsing
   ↓
Fallback & Safety Handling
   ↓
Response Delivery
   ↓
Logging + Memory Persistence
```
---

## 💡 Engineering Highlights

This project demonstrates:

Production-ready AI system design (not just chatbot logic)
Clean separation of retrieval vs reasoning vs business logic
Hybrid RAG + tool orchestration architecture
Structured output enforcement for backend reliability
Scalable design for real-world customer support use cases
Strong focus on hallucination reduction + grounding

---

## Local Setup

```
- git clone https://github.com/devitasari/kada-ai-assistant.git
- cd kada-ai-assistant
- npm install
- create .env file based on .env.example
- npm run dev
```

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

---

## Why This Project Matters

KADA AI Assistant is designed to reflect real-world AI engineering patterns, including:

Hybrid reasoning systems (rules + LLM + retrieval)
Production-safe AI responses
Scalable backend architecture
Clean separation of concerns
Enterprise-ready conversational AI design