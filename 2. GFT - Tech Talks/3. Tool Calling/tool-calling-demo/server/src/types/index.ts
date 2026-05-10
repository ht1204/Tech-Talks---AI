export type Scenario = 'weather' | 'calculator';
export type WeatherMode = 'mock' | 'live';

export interface ChatRequest {
  message: string;
  scenario: Scenario;
  weatherMode?: WeatherMode;
}

export type ToolCallType = 'user_message' | 'tool_definitions' | 'llm_decision' | 'tool_execution' | 'tool_result' | 'final_response';

export interface ToolCallStep {
  step: number;
  type: ToolCallType;
  label: string;
  description: string;
  data: Record<string, unknown>;
}

export interface ChatResponse {
  steps: ToolCallStep[];
  finalMessage: string;
  scenario: Scenario;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolExecuteOptions {
  weatherMode?: WeatherMode;
}

export interface ToolHandler {
  definition: ToolDefinition;
  execute: (args: Record<string, unknown>, options?: ToolExecuteOptions) => Promise<Record<string, unknown>>;
}
