import { useState, useEffect } from 'react';
import type { DocumentInfo, QueryResponse, HealthResponse } from './api';
import { api } from './api';

// ─── Styles ────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    maxWidth: 960,
    margin: '0 auto',
    padding: '24px 16px',
    color: '#1a1a2e',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: 32,
    padding: '24px 0',
    borderBottom: '2px solid #e9ecef',
  } as React.CSSProperties,

  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#1a1a2e',
  } as React.CSSProperties,

  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    margin: 0,
  } as React.CSSProperties,

  statusBar: (healthy: boolean) =>
    ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: healthy ? '#d4edda' : '#f8d7da',
      color: healthy ? '#155724' : '#721c24',
      marginTop: 8,
    }) as React.CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 32,
  } as React.CSSProperties,

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 16px 0',
    color: '#495057',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ced4da',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  } as React.CSSProperties,

  button: (variant: 'primary' | 'danger' | 'ghost') => {
    const base: React.CSSProperties = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    };
    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: '#4361ee', color: '#fff' };
      case 'danger':
        return { ...base, backgroundColor: '#e63946', color: '#fff', padding: '6px 12px', fontSize: 12 };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent', color: '#4361ee', padding: '6px 12px' };
    }
  },

  docItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f1f3f5',
  } as React.CSSProperties,

  docName: {
    fontWeight: 500,
    fontSize: 14,
  } as React.CSSProperties,

  docMeta: {
    fontSize: 12,
    color: '#868e96',
  } as React.CSSProperties,

  chatArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    marginBottom: 24,
  } as React.CSSProperties,

  messageUser: {
    backgroundColor: '#4361ee',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '12px 12px 4px 12px',
    marginBottom: 12,
    maxWidth: '80%',
    marginLeft: 'auto',
    fontSize: 14,
    lineHeight: 1.5,
  } as React.CSSProperties,

  messageBot: {
    backgroundColor: '#f1f3f5',
    color: '#1a1a2e',
    padding: '12px 16px',
    borderRadius: '12px 12px 12px 4px',
    marginBottom: 12,
    maxWidth: '80%',
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap' as const,
  } as React.CSSProperties,

  sources: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    fontSize: 12,
    color: '#6d4c00',
    border: '1px solid #ffe082',
  } as React.CSSProperties,

  sourceItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px dashed #ffe082',
  } as React.CSSProperties,

  inputRow: {
    display: 'flex',
    gap: 8,
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    color: '#adb5bd',
    padding: '32px 0',
    fontSize: 14,
  } as React.CSSProperties,

  spinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid #e9ecef',
    borderTopColor: '#4361ee',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: 8,
    verticalAlign: 'middle',
  } as React.CSSProperties,

  pipelineDiagram: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: 8,
    padding: 16,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 1.8,
    color: '#495057',
    marginBottom: 16,
    overflowX: 'auto' as const,
    whiteSpace: 'pre' as const,
  } as React.CSSProperties,
};

// ─── Types ─────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: QueryResponse['sources'];
}

// ─── App Component ─────────────────────────────────────────────

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textName, setTextName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Query state
  const [question, setQuestion] = useState('');
  const [querying, setQuerying] = useState(false);

  // Load health + documents on mount
  useEffect(() => {
    api.health().then(setHealth).catch(console.error);
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const stats = await api.getDocuments();
      setDocuments(stats.documents);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }

  async function handleUpload() {
    setUploading(true);
    setUploadStatus('');

    try {
      if (uploadMode === 'file' && selectedFile) {
        await api.uploadFile(selectedFile);
        setUploadStatus(`"${selectedFile.name}" uploaded and indexed!`);
        setSelectedFile(null);
      } else if (uploadMode === 'text' && textName && textContent) {
        await api.uploadText(textName, textContent);
        setUploadStatus(`"${textName}" uploaded and indexed!`);
        setTextName('');
        setTextContent('');
      } else {
        setUploadStatus('Please provide a file or text content');
        setUploading(false);
        return;
      }
      await loadDocuments();
    } catch (err) {
      setUploadStatus(`Error: ${err instanceof Error ? err.message : 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteDocument(id);
      await loadDocuments();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  }

  async function handleQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || querying) return;

    const userQuestion = question.trim();
    setQuestion('');
    setMessages((prev) => [...prev, { role: 'user', content: userQuestion }]);
    setQuerying(true);

    try {
      const result = await api.query(userQuestion);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.answer, sources: result.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Query failed'}`,
        },
      ]);
    } finally {
      setQuerying(false);
    }
  }

  const ollamaHealthy = health?.ollama?.healthy ?? false;

  return (
    <div style={styles.app}>
      {/* Inject keyframe animation for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>RAG MVP - Tech Talk Demo</h1>
        <p style={styles.subtitle}>
          Retrieval-Augmented Generation with Node.js + Ollama
        </p>
        <div style={styles.statusBar(ollamaHealthy)}>
          {ollamaHealthy
            ? `Ollama connected (${health?.ollama?.models?.length ?? 0} models)`
            : health
              ? `Ollama offline: ${health.ollama?.error}`
              : 'Checking Ollama...'}
        </div>
      </header>

      {/* Pipeline Diagram */}
      <div style={styles.pipelineDiagram}>
{`  RAG Pipeline:

  INGEST:  Upload doc --> Chunk text --> Embed chunks (Ollama) --> Store vectors (in-memory)
                                                                        |
  QUERY:   Question --> Embed query (Ollama) --> Cosine similarity search --+
              |                                        |
              +-- Prompt = question + top-K chunks --> Ollama LLM --> Answer`}
      </div>

      {/* Two-column layout: Upload + Documents */}
      <div style={styles.grid}>
        {/* Upload Panel */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>1. Upload Documents</h2>

          {/* Upload mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              style={styles.button(uploadMode === 'file' ? 'primary' : 'ghost')}
              onClick={() => setUploadMode('file')}
            >
              File Upload
            </button>
            <button
              style={styles.button(uploadMode === 'text' ? 'primary' : 'ghost')}
              onClick={() => setUploadMode('text')}
            >
              Paste Text
            </button>
          </div>

          {uploadMode === 'file' ? (
            <div>
              <input
                type="file"
                accept=".txt,.md,.pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ ...styles.input, padding: 8 }}
              />
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Document name..."
                value={textName}
                onChange={(e) => setTextName(e.target.value)}
                style={{ ...styles.input, marginBottom: 8 }}
              />
              <textarea
                placeholder="Paste document content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={5}
                style={{ ...styles.input, resize: 'vertical' as const }}
              />
            </div>
          )}

          <button
            style={{ ...styles.button('primary'), marginTop: 12, width: '100%', opacity: uploading ? 0.6 : 1 }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span style={styles.spinner} />
                Indexing...
              </>
            ) : (
              'Upload & Index'
            )}
          </button>

          {uploadStatus && (
            <p style={{ fontSize: 13, marginTop: 8, color: uploadStatus.startsWith('Error') ? '#e63946' : '#2d6a4f' }}>
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Documents Panel */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Knowledge Base ({documents.length} document{documents.length !== 1 ? 's' : ''})
          </h2>

          {documents.length === 0 ? (
            <div style={styles.emptyState}>
              No documents yet. Upload some to get started.
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} style={styles.docItem}>
                <div>
                  <div style={styles.docName}>{doc.name}</div>
                  <div style={styles.docMeta}>
                    {doc.chunksCount} chunks | {new Date(doc.uploadedAt).toLocaleString()}
                  </div>
                </div>
                <button
                  style={styles.button('danger')}
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat / Q&A Area */}
      <div style={styles.chatArea}>
        <h2 style={styles.cardTitle}>2. Ask Questions About Your Documents</h2>

        {/* Messages */}
        <div style={{ minHeight: 200, maxHeight: 500, overflowY: 'auto', marginBottom: 16, padding: '8px 0' }}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              Upload documents above, then ask questions here.
              <br />
              The system will retrieve relevant chunks and generate an answer using Ollama.
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i}>
                <div style={msg.role === 'user' ? styles.messageUser : styles.messageBot}>
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div style={styles.sources}>
                    <strong>Retrieved Sources:</strong>
                    {msg.sources.map((src, j) => (
                      <div key={j} style={styles.sourceItem}>
                        <div>
                          <strong>{src.documentName}</strong>{' '}
                          <span style={{ opacity: 0.7 }}>
                            (similarity: {(src.similarity * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div style={{ marginTop: 4, fontStyle: 'italic' }}>
                          "{src.chunkContent.slice(0, 200)}
                          {src.chunkContent.length > 200 ? '...' : ''}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {querying && (
            <div style={styles.messageBot}>
              <span style={styles.spinner} />
              Searching documents and generating answer...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleQuery} style={styles.inputRow}>
          <input
            type="text"
            placeholder="Ask a question about your documents..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ ...styles.input, flex: 1 }}
            disabled={querying}
          />
          <button
            type="submit"
            style={{ ...styles.button('primary'), opacity: querying ? 0.6 : 1 }}
            disabled={querying || !question.trim()}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
