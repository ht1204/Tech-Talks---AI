# Tool Calling Demo

Interactive demo that visualizes **how OpenAI Tool Calling (Function Calling) works**, step by step, with every JSON payload visible. Built for a tech talk presentation.

## What You'll See

When you ask a question like *"What's the weather in Madrid?"*, the app shows the full tool calling loop:

1. **User Message** — the natural language input sent to the LLM
2. **Tool Definitions** — JSON schemas of available functions sent alongside the prompt
3. **LLM Decision** — GPT-4o decides to call a tool and returns structured arguments
4. **Tool Execution** — the server runs the actual function and gets the result
5. **Tool Result** — the result is sent back to the LLM as a `tool` role message
6. **Final Response** — the LLM synthesizes a natural language answer from the tool output

Each step renders as a collapsible card with syntax-highlighted JSON, animated in sequence so the audience can follow the flow in real time.

## Scenarios

| Tab | Tool | Example |
|---|---|---|
| **Weather Lookup** | `get_weather(city, unit?)` | "What's the weather in Tokyo?" |
| **Calculator** | `calculate(expression)` | "What is 347 * 29 + 1582?" |

### Weather Data Source Toggle

The Weather tab includes a toggle to switch between two data sources:

| Mode | Description | Config Required |
|---|---|---|
| **Mock Data** (default) | Uses simulated in-memory data for 10 preset cities; unknown cities get random values | None |
| **Live API** | Calls the [OpenWeatherMap API](https://home.openweathermap.org/) in real time | `OPENWEATHER_API_KEY` in `.env` |

The step inspector labels which mode was used and includes a `dataSource` field in the JSON payload (`"mock"` or `"openweathermap"`).

## Architecture

```
tool-calling-demo/
├── server/          Express + TypeScript + OpenAI SDK
│   └── src/
│       ├── routes/        HTTP layer — POST /api/chat, GET /api/health
│       ├── services/      openai.service.ts — orchestrates the tool calling loop,
│       │                  captures every intermediate step as a trace
│       ├── tools/         Pure function implementations + JSON Schema definitions
│       │                  (weather.tool.ts, calculator.tool.ts, toolRegistry.ts)
│       └── types/         Shared TypeScript interfaces
│
├── client/          React + TypeScript + Tailwind CSS v4 + Vite
│   └── src/
│       ├── components/
│       │   ├── layout/      Header, TabSelector
│       │   ├── chat/        ChatInput, WeatherModeToggle (mock/live switch)
│       │   ├── inspector/   StepInspector, StepCard, FlowDiagram
│       │   └── ui/          Badge, JsonViewer (syntax-highlighted JSON)
│       ├── hooks/           useChat — state management + animated step reveal
│       ├── services/        api.ts — fetch wrapper
│       └── types/           Frontend TypeScript interfaces
```

### Backend Layers

| Layer | File | Responsibility |
|---|---|---|
| **Routes** | `chat.routes.ts` | Request validation, extracts `weatherMode` from body, error handling |
| **Service** | `openai.service.ts` | Tool calling loop: send prompt → receive `tool_calls` → execute tool (with mode) → send result → get final answer. Returns full `ToolCallStep[]` trace |
| **Tools** | `weather.tool.ts` | Two execution paths: `executeMock()` (in-memory data) and `executeLive()` (OpenWeatherMap API). Selected via `ToolExecuteOptions.weatherMode` |
| | `calculator.tool.ts` | Safe math expression evaluator |
| | `toolRegistry.ts` | Maps scenarios to tools, `executeTool()` dispatches with options |

### Frontend Layers

| Layer | File | Responsibility |
|---|---|---|
| **Components** | `components/*` | Pure UI — tabs, chat, weather mode toggle, step cards, JSON viewer |
| **Hooks** | `useChat.ts` | State management (`weatherMode`), API calls, animated step reveal (staggered 600ms per step) |
| **Services** | `api.ts` | HTTP fetch wrapper for `/api/chat`, passes `weatherMode` in body |

### Key Design Decision

The backend doesn't just return the final answer — it returns an array of `ToolCallStep[]` representing **every API call and response** in the tool calling loop. The frontend renders these steps one by one with a staggered animation, making the entire flow visible during a live demo.

The `weatherMode` flows through all layers (`client → API → route → service → toolRegistry → weather.tool`) via an options pattern on `ToolHandler.execute()`, keeping the tool implementations decoupled from transport concerns.

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key
- *(Optional)* An OpenWeatherMap API key — [get one free](https://home.openweathermap.org/) for live weather data

### 1. Configure environment

Create a `.env` file in the **project root** (or inside `server/`):

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required — OpenAI GPT-4o for tool calling
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional — enables "Live API" mode on the Weather tab
OPENWEATHER_API_KEY=your-openweathermap-api-key-here

PORT=3001
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm run dev
```

This starts both the server (`http://localhost:3001`) and the client (`http://localhost:5173`) concurrently. Open the client URL in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server + client concurrently |
| `npm run dev:server` | Start server only (port 3001) |
| `npm run dev:client` | Start client only (port 5173) |
| `npm run build` | Production build for client |
