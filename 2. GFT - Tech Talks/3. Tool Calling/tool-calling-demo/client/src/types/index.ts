export type Scenario = 'weather' | 'calculator';
export type WeatherMode = 'mock' | 'live';

export interface ToolCallStep {
  step: number;
  type: 'user_message' | 'tool_definitions' | 'llm_decision' | 'tool_execution' | 'tool_result' | 'final_response';
  label: string;
  description: string;
  data: Record<string, unknown>;
}

export interface ChatResponse {
  steps: ToolCallStep[];
  finalMessage: string;
  scenario: Scenario;
}

export interface ChatEntry {
  id: string;
  scenario: Scenario;
  userMessage: string;
  response: ChatResponse;
  timestamp: number;
}

export interface ScenarioConfig {
  id: Scenario;
  label: string;
  icon: string;
  placeholder: string;
  examples: string[];
  color: string;
}

export const SCENARIO_CONFIGS: Record<Scenario, ScenarioConfig> = {
  weather: {
    id: 'weather',
    label: 'Weather Lookup',
    icon: '🌤️',
    placeholder: 'Ask about the weather in any city...',
    examples: [
      "What's the weather in Madrid?",
      'Compare weather in Tokyo and London',
      'Is it sunny in Bogota?',
      'Tell me the weather in New York in fahrenheit',
    ],
    color: 'sky',
  },
  calculator: {
    id: 'calculator',
    label: 'Calculator',
    icon: '🧮',
    placeholder: 'Enter a math expression or question...',
    examples: [
      'What is 347 * 29 + 1582?',
      'Calculate the area of a circle with radius 5',
      'What is the square root of 144?',
      'Calculate 2 ** 10 + sqrt(49)',
    ],
    color: 'violet',
  },
};

export const STEP_COLORS: Record<ToolCallStep['type'], { bg: string; border: string; badge: string; text: string }> = {
  user_message: { bg: 'bg-blue-950/40', border: 'border-blue-500/30', badge: 'bg-blue-600', text: 'text-blue-300' },
  tool_definitions: { bg: 'bg-amber-950/40', border: 'border-amber-500/30', badge: 'bg-amber-600', text: 'text-amber-300' },
  llm_decision: { bg: 'bg-purple-950/40', border: 'border-purple-500/30', badge: 'bg-purple-600', text: 'text-purple-300' },
  tool_execution: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', badge: 'bg-emerald-600', text: 'text-emerald-300' },
  tool_result: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/30', badge: 'bg-cyan-600', text: 'text-cyan-300' },
  final_response: { bg: 'bg-green-950/40', border: 'border-green-500/30', badge: 'bg-green-600', text: 'text-green-300' },
};
