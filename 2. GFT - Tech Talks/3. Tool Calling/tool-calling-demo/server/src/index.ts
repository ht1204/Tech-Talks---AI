import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRoutes from './routes/chat.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log('\n  Tool Calling Demo - Server');
  console.log('  =========================');
  console.log(`  Server:      http://localhost:${PORT}`);
  console.log(`  Health:      http://localhost:${PORT}/api/health`);
  console.log(`  Chat API:    http://localhost:${PORT}/api/chat`);
  console.log(`  API Key:     ${process.env.OPENAI_API_KEY ? 'Configured' : 'MISSING - set OPENAI_API_KEY in .env'}`);
  console.log('  =========================\n');

  if (!process.env.OPENAI_API_KEY) {
    console.warn('  WARNING: OPENAI_API_KEY not found. Copy .env.example to .env and add your key.\n');
  }
});

process.on('SIGINT', () => {
  console.log('\n  Shutting down server...');
  process.exit(0);
});
