import OpenAI from 'openai';
import type { ChatRequest, ChatResponse, Scenario, ToolCallStep } from '../types/index.js';
import { getToolDefinitions, executeTool } from '../tools/toolRegistry.js';

const SYSTEM_PROMPTS: Record<Scenario, string> = {
  weather: `You are a helpful weather assistant. When users ask about weather, use the get_weather tool to fetch current weather data. Always provide a friendly, natural language summary of the weather data returned by the tool. If the user asks about multiple cities, call the tool once for each city.`,
  calculator: `You are a helpful math assistant. When users ask you to perform calculations, ALWAYS use the calculate tool to compute the result. Never try to do math yourself - always delegate to the tool. Express the user's request as a valid mathematical expression and pass it to the calculate tool. Present the result clearly.`,
};

export async function processToolCallingChat(request: ChatRequest): Promise<ChatResponse> {
  const { message, scenario, weatherMode = 'mock' } = request;
  const steps: ToolCallStep[] = [];
  let stepNumber = 0;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const toolDefinitions = getToolDefinitions(scenario);

  const addStep = (type: ToolCallStep['type'], label: string, description: string, data: Record<string, unknown>) => {
    stepNumber++;
    steps.push({ step: stepNumber, type, label, description, data });
  };

  addStep('user_message', 'User sends message', 'The user sends a natural language message to the LLM.', {
    role: 'user',
    content: message,
  });

  addStep('tool_definitions', 'Tools are registered', 'The available tools (functions) are sent to the LLM as part of the API request. The LLM uses these schemas to decide if and how to call a tool.', {
    tools: toolDefinitions,
  });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPTS[scenario] },
    { role: 'user', content: message },
  ];

  const requestOptions: OpenAI.Chat.ChatCompletionCreateParams = {
    model: 'gpt-4o',
    messages,
    tools: toolDefinitions as unknown as OpenAI.Chat.ChatCompletionTool[],
    tool_choice: 'auto',
  };

  let finalMessage = '';
  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    iterations++;

    const response = await openai.chat.completions.create(requestOptions);
    const assistantMessage = response.choices[0].message;

    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      addStep('llm_decision', `LLM decides to call tool${assistantMessage.tool_calls.length > 1 ? 's' : ''}: ${assistantMessage.tool_calls.map(tc => tc.function.name).join(', ')}`, 'The LLM analyzed the user message and decided it needs to call one or more tools. Instead of replying directly, it returns a tool_calls array with the function name and arguments.', {
        role: 'assistant',
        content: assistantMessage.content || null,
        tool_calls: assistantMessage.tool_calls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      });

      messages.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        const toolResult = await executeTool(toolName, scenario, toolArgs, { weatherMode });

        if (!toolResult) {
          const errorResult = { error: `Unknown tool: ${toolName}` };
          addStep('tool_execution', `Tool execution failed: ${toolName}`, `The tool "${toolName}" was not found in the registry.`, {
            tool: toolName,
            arguments: toolArgs,
            error: errorResult,
          });
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(errorResult),
          } as OpenAI.Chat.ChatCompletionToolMessageParam);
          continue;
        }

        addStep('tool_execution', `Tool executed: ${toolName} (${weatherMode === 'live' ? 'Live API' : 'Mock Data'})`, `The backend receives the tool call, executes the actual function implementation (${weatherMode === 'live' ? 'calling OpenWeatherMap API' : 'using mock data'}), and gets the result. This is the "action" part - the LLM doesn't run the tool itself, the server does.`, {
          tool: toolName,
          mode: weatherMode,
          arguments_received: toolArgs,
          result: toolResult,
        });

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        } as OpenAI.Chat.ChatCompletionToolMessageParam);
      }

      addStep('tool_result', 'Tool results sent back to LLM', 'The tool execution results are sent back to the LLM as tool role messages. The LLM will now process these results to generate a natural language response.', {
        messages_sent_back: messages.slice(-assistantMessage.tool_calls.length).map(m => ({
          role: 'tool',
          content: typeof m === 'object' && 'content' in m ? m.content : '',
        })),
      });

      requestOptions.messages = messages;
    } else {
      finalMessage = assistantMessage.content || 'No response generated.';

      addStep('final_response', 'LLM generates final response', 'The LLM receives the tool results and generates a natural language response for the user. No more tool calls are needed.', {
        role: 'assistant',
        content: finalMessage,
        finish_reason: response.choices[0].finish_reason,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens,
          completion_tokens: response.usage?.completion_tokens,
          total_tokens: response.usage?.total_tokens,
        },
      });

      break;
    }
  }

  if (!finalMessage) {
    finalMessage = 'Reached maximum tool calling iterations.';
  }

  return { steps, finalMessage, scenario };
}
