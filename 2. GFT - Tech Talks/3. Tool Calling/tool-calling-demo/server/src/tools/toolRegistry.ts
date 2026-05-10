import type { Scenario, ToolHandler, ToolExecuteOptions } from '../types/index.js';
import { weatherTool } from './weather.tool.js';
import { calculatorTool } from './calculator.tool.js';

const toolsByScenario: Record<Scenario, ToolHandler[]> = {
  weather: [weatherTool],
  calculator: [calculatorTool],
};

export function getToolsForScenario(scenario: Scenario): ToolHandler[] {
  return toolsByScenario[scenario];
}

export function getToolByName(name: string, scenario: Scenario): ToolHandler | undefined {
  return toolsByScenario[scenario].find(t => t.definition.name === name);
}

export function getToolDefinitions(scenario: Scenario): Record<string, unknown>[] {
  return toolsByScenario[scenario].map(t => ({
    type: 'function',
    function: t.definition,
  }));
}

export async function executeTool(
  toolName: string,
  scenario: Scenario,
  args: Record<string, unknown>,
  options?: ToolExecuteOptions,
): Promise<Record<string, unknown> | null> {
  const tool = getToolByName(toolName, scenario);
  if (!tool) return null;
  return tool.execute(args, options);
}
