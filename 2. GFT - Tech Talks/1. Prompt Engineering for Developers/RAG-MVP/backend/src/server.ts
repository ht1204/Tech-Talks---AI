// Express server — REST API for the RAG system
//
// Endpoints:
//   POST   /api/documents       Upload a document (file or raw text)
//   GET    /api/documents       List all documents
//   DELETE /api/documents/:id   Delete a document
//   POST   /api/query           Ask a question (RAG pipeline)
//   GET    /api/health          Health check (includes Ollama status)

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ingestDocument, queryRAG, getStats, deleteDocument } from './ragEngine.js';
import { checkOllamaHealth } from './ollama.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['.txt', '.md', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}`));
    }
  },
});

// ─── HEALTH CHECK ──────────────────────────────────────────────

app.get('/api/health', async (_req, res) => {
  const ollamaStatus = await checkOllamaHealth();
  const stats = getStats();

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    ollama: ollamaStatus,
    store: {
      documents: stats.documentsCount,
      chunks: stats.chunksCount,
    },
  });
});

// ─── UPLOAD DOCUMENT ───────────────────────────────────────────

app.post('/api/documents', upload.single('file'), async (req, res) => {
  try {
    let content: string;
    let name: string;

    if (req.file) {
      // File upload
      name = req.file.originalname;
      const ext = path.extname(name).toLowerCase();

      if (ext === '.pdf') {
        // Dynamic import for pdf-parse
        const pdfParse = (await import('pdf-parse')).default;
        const buffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(buffer);
        content = pdfData.text;
      } else {
        content = fs.readFileSync(req.file.path, 'utf-8');
      }

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    } else if (req.body.text && req.body.name) {
      // Raw text upload via JSON body
      name = req.body.name;
      content = req.body.text;
    } else {
      res.status(400).json({
        error: 'Provide either a file upload or JSON body with "name" and "text" fields',
      });
      return;
    }

    if (content.trim().length === 0) {
      res.status(400).json({ error: 'Document content is empty' });
      return;
    }

    const doc = await ingestDocument(name, content);

    res.status(201).json({
      message: `Document "${name}" ingested successfully`,
      document: {
        id: doc.id,
        name: doc.name,
        chunksCount: doc.chunksCount,
        uploadedAt: doc.uploadedAt,
      },
    });
  } catch (error) {
    console.error('[API] Upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to ingest document: ${message}` });
  }
});

// ─── LIST DOCUMENTS ────────────────────────────────────────────

app.get('/api/documents', (_req, res) => {
  const stats = getStats();
  res.json(stats);
});

// ─── DELETE DOCUMENT ───────────────────────────────────────────

app.delete('/api/documents/:id', (req, res) => {
  const deleted = deleteDocument(req.params.id);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

// ─── QUERY (RAG) ──────────────────────────────────────────────

app.post('/api/query', async (req, res) => {
  try {
    const { question, topK } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ error: 'A non-empty "question" field is required' });
      return;
    }

    const result = await queryRAG(question.trim(), topK || 3);

    res.json(result);
  } catch (error) {
    console.error('[API] Query error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Query failed: ${message}` });
  }
});

// ─── START SERVER ──────────────────────────────────────────────

const PORT = Number(process.env.PORT || 3001);

const server = app.listen(PORT, 'localhost', () => {
  console.log(`\n🚀 RAG API server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET    /api/health`);
  console.log(`   POST   /api/documents    (upload a document)`);
  console.log(`   GET    /api/documents    (list documents)`);
  console.log(`   DELETE /api/documents/:id`);
  console.log(`   POST   /api/query        (ask a question)\n`);

  // Check Ollama on startup
  checkOllamaHealth().then((status) => {
    if (status.healthy) {
      console.log(`✅ Ollama connected. Available models: ${status.models.join(', ')}`);
    } else {
      console.log(`⚠️  Ollama not available: ${status.error}`);
      console.log(`   Make sure Ollama is running: ollama serve`);
      console.log(`   Required models: ollama pull nomic-embed-text && ollama pull llama3.2\n`);
    }
  });
});

// Disable request timeout (embedding many chunks can take a while)
server.requestTimeout = 0;
server.headersTimeout = 0;

export { app };
