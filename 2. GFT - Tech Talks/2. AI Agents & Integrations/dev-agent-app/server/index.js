import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiKeyConfigured: hasApiKey
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      messages, 
      system, 
      model = 'claude-sonnet-4-20250514', 
      max_tokens = 2000 
    } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: {
          message: 'Messages array is required',
          type: 'invalid_request'
        }
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: {
          message: 'API key not configured. Please set ANTHROPIC_API_KEY in .env file',
          type: 'configuration_error'
        }
      });
    }
    
    console.log(`📨 Chat request received: ${messages.length} messages`);
    
    // Call Anthropic API
    const message = await client.messages.create({
      model,
      max_tokens,
      system,
      messages
    });
    
    console.log('✅ API response received successfully');
    res.json(message);
    
  } catch (error) {
    console.error('❌ Anthropic API Error:', error.message);
    
    // Handle different error types
    let statusCode = 500;
    let errorResponse = {
      message: error.message,
      type: error.type || 'api_error'
    };

    if (error.status) {
      statusCode = error.status;
    }

    // Specific error handling
    if (error.message?.includes('api_key')) {
      errorResponse.message = 'Invalid API key. Please check your ANTHROPIC_API_KEY';
      errorResponse.type = 'authentication_error';
    }

    res.status(statusCode).json({ error: errorResponse });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Dev Agent Proxy Server Started');
  console.log('================================');
  console.log(`📡 Server:      http://localhost:${PORT}`);
  console.log(`💚 Health:      http://localhost:${PORT}/health`);
  console.log(`🤖 Chat API:    http://localhost:${PORT}/api/chat`);
  console.log(`🔑 API Key:     ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('================================\n');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not found in environment');
    console.warn('⚠️  Create a .env file with: ANTHROPIC_API_KEY=your-key-here\n');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});
