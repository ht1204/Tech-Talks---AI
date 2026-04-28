# RAG MVP - Tech Talk Demo

A minimal Retrieval-Augmented Generation (RAG) system built with Node.js, Express, React, and **Ollama** (local LLM). Upload documents, ask questions, and get AI-generated answers grounded in your data.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        RAG Pipeline                             │
│                                                                 │
│  INGEST (Indexing):                                             │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐   ┌────────────┐ │
│  │  Upload   │──>│  Chunk   │──>│  Embed    │──>│  Vector    │ │
│  │  Document │   │  Text    │   │  (Ollama) │   │  Store     │ │
│  └──────────┘   └──────────┘   └───────────┘   └────────────┘ │
│                                                       │         │
│  QUERY (Retrieval + Generation):                      │         │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐         │         │
│  │  User     │──>│  Embed   │──>│  Cosine   │─────────┘         │
│  │  Question │   │  Query   │   │  Search   │                   │
│  └──────────┘   └──────────┘   └─────┬─────┘                   │
│                                       │                         │
│                        ┌──────────────▼──────────────┐          │
│                        │  Prompt = Question + Top-K  │          │
│                        │  Retrieved Chunks           │          │
│                        └──────────────┬──────────────┘          │
│                                       │                         │
│                              ┌────────▼────────┐                │
│                              │  Ollama LLM     │                │
│                              │  (llama3.2)     │                │
│                              └────────┬────────┘                │
│                                       │                         │
│                              ┌────────▼────────┐                │
│                              │  Answer + Sources│                │
│                              └─────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component        | Technology                      |
|------------------|---------------------------------|
| Backend          | Node.js + Express + TypeScript  |
| Frontend         | React 18 + Vite + TypeScript    |
| LLM              | Ollama (llama3.2, local)        |
| Embeddings       | Ollama (nomic-embed-text)       |
| Vector Store     | In-memory (cosine similarity)   |
| File Parsing     | multer + pdf-parse              |

## Project Structure

```
RAG-MVP/
├── backend/
│   ├── src/
│   │   ├── server.ts        # Express API routes
│   │   ├── ragEngine.ts     # RAG pipeline orchestrator
│   │   ├── ollama.ts        # Ollama API client (embeddings + generation)
│   │   ├── chunker.ts       # Text chunking with overlap
│   │   ├── vectorStore.ts   # In-memory vector DB with cosine similarity
│   │   └── types.ts         # TypeScript interfaces
│   ├── uploads/              # Temp file uploads (auto-cleaned)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx          # React entry point
│   │   ├── App.tsx           # Main UI (upload + chat)
│   │   └── api.ts            # HTTP API service layer
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts        # Vite config with API proxy
├── sample-docs/              # Sample documents for demo
│   ├── rag-overview.txt
│   ├── ollama-guide.txt
│   └── vector-databases.txt
├── package.json              # Root monorepo (concurrently)
└── README.md
```

## Prerequisites

1. **Node.js** (v18+)
2. **Ollama** installed and running

### Install Ollama & Models

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Pull required models (in another terminal)
ollama pull nomic-embed-text   # Embedding model (~274MB)
ollama pull llama3.2           # Generation model (~2GB)
```

## Quick Start

```bash
# 1. Install all dependencies
cd RAG-MVP
npm run install:all

# 2. Make sure Ollama is running (in a separate terminal)
ollama serve

# 3. Start the app
npm run dev

# 4. Open http://localhost:3000
```

## How It Works (Step by Step)

### 1. Document Ingestion

When you upload a document:

1. **Parse**: Text is extracted (plain text or PDF)
2. **Chunk**: Text is split into ~500 character overlapping chunks (`chunker.ts`)
   - Respects paragraph boundaries
   - 50-character overlap preserves context between chunks
3. **Embed**: Each chunk is sent to Ollama's `nomic-embed-text` model, which returns a 768-dimensional vector (`ollama.ts`)
4. **Store**: Chunks + vectors are saved in the in-memory vector store (`vectorStore.ts`)

### 2. Question Answering (RAG)

When you ask a question:

1. **Embed Query**: Your question is converted to a 768-dim vector using the same embedding model
2. **Retrieve**: Cosine similarity is computed against all stored chunk vectors. The top 3 most similar chunks are selected (`vectorStore.ts`)
3. **Augment**: A prompt is built combining your question + the retrieved chunks as context (`ragEngine.ts`)
4. **Generate**: The augmented prompt is sent to Ollama's `llama3.2` model, which generates an answer grounded in the retrieved context
5. **Respond**: The answer + source chunks (with similarity scores) are returned to the UI

## API Endpoints

| Method   | Endpoint              | Description                    |
|----------|-----------------------|--------------------------------|
| `GET`    | `/api/health`         | Health check + Ollama status   |
| `POST`   | `/api/documents`      | Upload a document (file/text)  |
| `GET`    | `/api/documents`      | List all indexed documents     |
| `DELETE` | `/api/documents/:id`  | Remove a document              |
| `POST`   | `/api/query`          | Ask a question (RAG pipeline)  |

### Example: Upload via cURL

```bash
# Upload a file
curl -X POST http://localhost:3001/api/documents \
  -F "file=@sample-docs/rag-overview.txt"

# Upload raw text
curl -X POST http://localhost:3001/api/documents \
  -H "Content-Type: application/json" \
  -d '{"name": "My Notes", "text": "RAG combines retrieval and generation..."}'
```

### Example: Query via cURL

```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is cosine similarity?"}'
```

## Key Concepts Demonstrated

| Concept                   | Where in Code                  |
|---------------------------|--------------------------------|
| Text Chunking (overlap)   | `backend/src/chunker.ts`       |
| Embedding Generation      | `backend/src/ollama.ts`        |
| Cosine Similarity Search  | `backend/src/vectorStore.ts`   |
| RAG Prompt Engineering    | `backend/src/ragEngine.ts`     |
| Full Pipeline Orchestration | `backend/src/ragEngine.ts`   |

## Demo Script (for Tech Talk)

1. **Start the app** and show the empty state
2. **Explain the pipeline diagram** shown in the UI
3. **Upload** the 3 sample documents from `sample-docs/`
4. **Ask questions** like:
   - "What is RAG and why is it useful?"
   - "How does cosine similarity work?"
   - "What embedding model does Ollama support?"
   - "Compare ChromaDB and Pinecone"
5. **Show the sources panel** — demonstrate that answers are grounded in the uploaded docs
6. **Walk through the code** — each file is self-contained and heavily commented
7. **Delete a document** and ask the same question again to show the difference

## Limitations (MVP)

- **In-memory storage**: Data is lost on server restart. Production would use ChromaDB/Pinecone/pgvector.
- **No streaming**: Answers are returned all at once. Production would stream tokens.
- **No authentication**: Open access to all endpoints.
- **Single-threaded embedding**: Chunks are embedded sequentially. Production would batch/parallelize.
- **No reranking**: Uses raw cosine similarity. Advanced RAG adds a reranker step for better precision.

## Environment Variables

| Variable           | Default                    | Description               |
|--------------------|----------------------------|---------------------------|
| `PORT`             | `3001`                     | Backend server port       |
| `OLLAMA_URL`       | `http://127.0.0.1:11434`  | Ollama API URL            |
| `EMBEDDING_MODEL`  | `nomic-embed-text`         | Ollama embedding model    |
| `GENERATION_MODEL` | `llama3.2`                 | Ollama generation model   |
