import type { ChatResponse, Scenario, WeatherMode } from '../types/index';

const API_BASE = '/api';

export async function sendChatMessage(
  message: string,
  scenario: Scenario,
  weatherMode?: WeatherMode,
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, scenario, weatherMode }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<{
  status: string;
  apiKeyConfigured: boolean;
  openWeatherMapKeyConfigured: boolean;
}> {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
