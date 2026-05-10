import { Router, type Request, type Response } from 'express';
import { processToolCallingChat } from '../services/openai.service.js';
import type { ChatRequest, Scenario, WeatherMode } from '../types/index.js';

const router = Router();

const VALID_SCENARIOS: Scenario[] = ['weather', 'calculator'];
const VALID_WEATHER_MODES: WeatherMode[] = ['mock', 'live'];

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, scenario, weatherMode } = req.body as ChatRequest;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
      return;
    }

    if (!scenario || !VALID_SCENARIOS.includes(scenario)) {
      res.status(400).json({ error: `Scenario must be one of: ${VALID_SCENARIOS.join(', ')}` });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({
        error: 'OPENAI_API_KEY is not configured. Please set it in the .env file.',
      });
      return;
    }

    console.log(`[${new Date().toISOString()}] Chat request: scenario=${scenario}, weatherMode=${weatherMode || 'mock'}, message="${message.substring(0, 80)}..."`);

    const result = await processToolCallingChat({ message: message.trim(), scenario, weatherMode: weatherMode || 'mock' });

    console.log(`[${new Date().toISOString()}] Response: ${result.steps.length} steps generated`);

    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);

    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const status = (error as { status?: number })?.status || 500;

    res.status(status).json({ error: message });
  }
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.OPENAI_API_KEY,
    openWeatherMapKeyConfigured: !!process.env.OPENWEATHER_API_KEY,
  });
});

export default router;
