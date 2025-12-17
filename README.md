# QA Automation Portfolio — Playwright + TypeScript + API + Performance + RAG

This repository contains a complete **QA Automation Framework** built with **Playwright (TypeScript)**.  
It demonstrates real-world testing practices including UI testing, API testing, performance testing (Artillery & JMeter), environment configurations, fixtures, POM architecture, and CI/CD pipelines using GitHub Actions.

The test framework combines traditional automated testing practices with a **Retrieval-Augmented Generation (RAG)** implementation. The goal is to demonstrate how modern QA teams can integrate LLM-ready knowledge retrieval into their workflows while keeping the system transparent, testable, and vendor-independent.

---

## 🚀 Technologies & Tools

- **QA Automation**
  - Playwright (UI + API)
  - TypeScript
  - Page Object Model (POM)
  - Custom Playwright Fixtures
  - Environment-specific configuration files

- **Performance Testing**
  - Artillery (YAML-based load scenarios)
  - Apache JMeter (.jmx test plans)

- **CI/CD**
  - GitHub Actions workflows

---

## 🧩 Design Decisions

1. **Modular Framework Architecture**  
   The project is separated into UI tests, API tests, fixtures, helpers, page objects, performance tests, and environment configs. This ensures scalability, maintainability, and clarity.

2. **Page Object Model (POM)**  
   All UI logic is abstracted behind Page Objects to produce clean, readable, reusable test cases.
   - Examples: `login.page.ts`, `dashboard.page.ts`, `base.page.ts`

3. **Custom Fixtures**  
   Fixtures provide clean test setup/teardown and shared utilities such as:
   - Typed API client
   - Context and page initialization
   - Environment injection
   - Authentication helpers  
   This keeps test files minimal and easy to understand.

4. **Environment-Specific Configs**  
   Located under `/config` for `dev`, `qa`, and `prod`.  
   Load them via CLI when required:
   ```bash
   npx playwright test --config=config/qa.config.ts

5. **Integrated API Testing**  
   API tests use:
    - Playwright’s built-in APIRequestContext
    - A small typed API client wrapper
    - Dedicated fixtures and helpers
    - Optional mocking utilities
        Example included: src/api/tests/users.spec.ts   

6. **Performance Testing Included**  
    The framework includes performance tests to showcase load testing skills.
    JMeter
    - .jmx test plans included in performance/jmeter/
    - Dataset folder and run instructions
    - Editors may show the informational warning: “No grammar constraints (DTD or XML Schema)” — this is expected and harmless.
    
    Artillery
    - YAML load-test scenarios in performance/artillery/
    - CLI-ready commands and scenarios

7. **CI/CD with GitHub Actions**   
    The framework includes performance tests to showcase load testing skills     
    Workflows included:
    - ui-tests.yml — Playwright UI tests
    - api-tests.yml — API test pipeline
    - performance.yml — Artillery/JMeter load tests

    Each workflow supports:
    - HTML report artifacts
    - Pull request integration
    - Matrix runs and parallel execution  

## 🧠 Retrieval-Augmented Generation (RAG)

### What is RAG?

Retrieval-Augmented Generation (RAG) is an architectural pattern where a Large Language Model (LLM) is augmented with external knowledge retrieved at query time.

Instead of relying only on the model’s pretrained weights, the system:

1. **Retrieves** relevant documents from a vector database using semantic similarity
2. **Augments** the user prompt with that context
3. **Generates** an answer grounded in real source material

This approach significantly reduces hallucinations and enables domain-specific reasoning without retraining the model.

---

## 🏗️ RAG Architecture in This Project

The RAG pipeline implemented in this repository consists of the following components:

### 1. Knowledge Base

- Markdown files stored under the `knowledge/` directory
- Each file represents authoritative, curated QA knowledge

### 2. Chunking Layer

- Documents are split into semantic chunks using a token-aware chunker
- Chunk overlap preserves contextual continuity across boundaries
- Each chunk receives a stable, traceable identifier

### 3. Embedding Service

- Embeddings are generated via a local FastAPI service (Uvicorn)
- Model: `sentence-transformers/all-MiniLM-L6-v2`
- Embedding dimension: **384**

### 4. Vector Store

- ChromaDB is used to persist embeddings and metadata
- Stored metadata includes:
  - Source file
  - Chunk index
  - Knowledge source label

### 5. Retrieval Engine

- Queries are embedded using the same model as indexing
- Top-N most similar chunks are retrieved via cosine distance
- Results are ranked and returned with distances and metadata

### 6. LLM-Ready Output

- Retrieved chunks are structured for direct prompt injection
- Can be consumed by OpenAI, Claude, or any compatible LLM

---

## ✅ Benefits of this RAG Approach

- **Grounded responses** based on verified documents
- **Reduced hallucinations** through explicit context injection
- **Updatable knowledge** without retraining models
- **Explainability** via source attribution
- **Vendor independence** (local embeddings, pluggable LLMs)
- **QA-aligned design** with traceability and determinism

---

### 🧠 RAG Use Cases in This Project

The implemented RAG pipeline is oriented toward real QA workflows, such as:

- Answering questions like:
  - *“How should we test this API?”*
  - *“What are our Playwright best practices?”*
  - *“What makes a good acceptance criterion?”*
- Assisting new team members with project-specific standards
- Acting as an internal QA knowledge assistant
- Exploring future integrations (Slack bot, CLI assistant, PR review helper)

---

## 🌍 Real-World RAG Use Cases

This implementation mirrors how RAG is applied in production environments:

### Internal Knowledge Assistants
- Engineering handbooks
- QA standards and testing strategies
- Playwright and automation best practices

### Customer Support Copilots
- Product documentation search
- Guided troubleshooting

### Compliance and Legal Systems
- Regulatory text interpretation
- Policy search with auditable sources

### QA & Testing Intelligence
- Querying acceptance criteria
- Test design assistance
- Risk-based testing guidance

### Developer Enablement
- Architecture decision records (ADRs)
- Coding standards and conventions

---

## Typical RAG Flow

1. User submits a natural language question
2. The query is embedded using the same embedding model
3. ChromaDB retrieves the most similar chunks
4. Retrieved content is passed to an LLM as trusted context
5. The LLM generates a grounded, context-aware answer

---

## 🧩 Design Philosophy

This project intentionally avoids black-box abstractions.

Each RAG component is:

- Explicit
- Replaceable
- Independently testable

This makes the system suitable not only for experimentation, but also for **enterprise QA environments** where explainability, determinism, and auditability matter.

---

## ▶️ How to Run the Project

Install dependencies
```bash
npm install
```

Run all tests (UI + API)
```bash
npx playwright test
```

Run UI tests only
```bash
npx playwright test src/ui/tests
```

Run API tests only
```bash
npx playwright test src/api/tests
```

Run tests with a specific environment
```bash
npx playwright test --config=config/qa.config.ts
```

Run Artillery load tests
```bash
npx artillery run performance/artillery/load-test.yml
```

Run JMeter plans (JMeter must be installed or run via container)
```bash
jmeter -n -t performance/jmeter/login.jmx -l performance/jmeter/results.jtl    
```

Reset the Chroma db
```bash
npx ts-node scripts/rag/reset-chroma.ts
```

Load the knowledge db
```bash
npx ts-node scripts/rag/seed-docs.ts
```

Query the RAG service
```bash
npx ts-node scripts/rag/query.ts "how to test an API"
```
---

## 📌 Notes

- Meter .jmx files are XML and editors may show the warning:
“No grammar constraints (DTD or XML Schema)”. This is informational only and does not affect execution.

- Playwright reports are generated inside playwright-report/ after test runs (if configured in playwright.config.ts).

- Use Node.js >= 16 (recommended 18) when running TypeScript-based fixtures and tests. If necessary, use ts-node for running TypeScript scripts directly.

## 📘 Purpose of This Repository

This repository serves as both a **practical QA tool** and a **learning reference**. It also serves as a QA Engineer portfolio, demonstrating skills in:

- Automation framework design

- UI testing with Playwright

- API automation architecture

- Performance testing (Artillery & JMeter)

- CI/CD integration and reporting

- Engineering judgement and QA strategy

- RAG-based systems
