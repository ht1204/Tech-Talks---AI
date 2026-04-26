# AI Software Development Agent

A production-ready AI development agent built with React + Vite, featuring a clean layered architecture and real-time AI responses powered by Claude.

> **⚠️ IMPORTANT**: You need an Anthropic API key to use this application. See [Quick Setup](#-quick-setup) below.

## 🎯 Project Overview

This is a reengineered version of the original MVP AI Development Agent, demonstrating best practices in software engineering:

- **Layered Architecture**: Clear separation between presentation, business logic, and data layers
- **Component-Based Design**: Modular, reusable UI components
- **Custom Hooks**: Encapsulated state management and side effects
- **Service Layer**: Isolated API communication and business logic
- **Utility Functions**: Reusable helper functions
- **Constants Management**: Centralized configuration

## 📁 Project Structure

```
dev-agent-app/
├── src/                        # Frontend React Application
│   ├── components/             # UI Components (Presentation Layer)
│   │   ├── Header.jsx
│   │   ├── PhaseIndicator.jsx
│   │   ├── ToolsPanel.jsx
│   │   ├── WelcomeScreen.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── LoadingIndicator.jsx
│   │   ├── InputArea.jsx
│   │   └── Footer.jsx
│   ├── hooks/                  # Custom React Hooks (State Management)
│   │   ├── useAgentChat.js
│   │   └── useScrollToBottom.js
│   ├── services/               # Business Logic & External Services
│   │   ├── apiService.js       # Anthropic API communication
│   │   └── phaseService.js     # Phase simulation logic
│   ├── utils/                  # Utility Functions
│   │   ├── formatters.js       # Message formatting
│   │   └── taskDetector.js     # Task type detection
│   ├── constants/              # Configuration & Constants
│   │   └── agentConstants.js
│   ├── App.jsx                 # Main Application Component
│   ├── App.css                 # Application Styles
│   ├── main.jsx                # Application Entry Point
│   └── index.css               # Global Styles
├── server/                     # Backend Proxy Server
│   ├── index.js                # Express server with Anthropic SDK
│   └── package.json            # Server dependencies
├── public/                     # Static Assets
├── .env                        # Environment variables (create this!)
├── .env.example                # Environment template
├── package.json                # Root package (orchestrates both)
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (`/components`)
- Pure UI components
- No business logic
- Receives data via props
- Emits events via callbacks

### 2. **State Management Layer** (`/hooks`)
- Custom React hooks
- Encapsulates component state and side effects
- Provides clean API to components

### 3. **Service Layer** (`/services`)
- API communication
- Business logic
- External service integration
- Data transformation

### 4. **Utility Layer** (`/utils`)
- Helper functions
- Pure functions (no side effects)
- Reusable across the application

### 5. **Configuration Layer** (`/constants`)
- Application constants
- Configuration objects
- Static data

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Anthropic API Key ([Get one here](https://console.anthropic.com/))

### Installation (4 Steps)

1. **Navigate to the project directory**:
```bash
cd dev-agent-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** in the project root with your Anthropic API key:
```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
```

> You can copy `.env.example` and update it with your key

4. **Start the application**:
```bash
npm start
```

This single command starts both:
- Backend proxy server (port 3001)
- Frontend React app (port 5173)

5. **Open your browser** to `http://localhost:5173`

### Understanding the Architecture

**Why do we need a proxy server?**

The Anthropic API cannot be called directly from browsers due to CORS (Cross-Origin Resource Sharing) restrictions. This is a security feature to protect your API key from being exposed in client-side code.

**Our solution: Local Proxy Server**

```
Browser (React) → Proxy Server (Express) → Anthropic API
                  (with secure API key)
```

The proxy server:
- ✅ Securely stores your API key server-side
- ✅ Handles CORS issues
- ✅ Forwards requests to Anthropic API
- ✅ Returns AI responses to your app

### Available Scripts

```bash
npm start          # Start both frontend and backend (recommended)
npm run dev        # Start frontend only (port 5173)
npm run dev:server # Start backend only (port 3001)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔧 Troubleshooting

### Getting 401 Unauthorized Error?

**Cause**: Invalid or missing Anthropic API key

**Solution**:
1. Check your `.env` file has a valid API key starting with `sk-ant-api03-...`
2. Restart both servers: Stop with Ctrl+C, then run `npm start` again
3. Verify the key is working at: http://localhost:3001/health

### Server Not Starting?

**Cause**: Port already in use or dependencies not installed

**Solution**:
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Reinstall dependencies
rm -rf node_modules server/node_modules
npm install
cd server && npm install && cd ..
npm start
```

### No API Responses?

**Cause**: Backend server not running or wrong API URL

**Solution**:
1. Check console output - both servers should start
2. Verify backend health: http://localhost:3001/health
3. Check `src/constants/agentConstants.js` has `API_BASE_URL: 'http://localhost:3001'`

### ESLint Errors?

**Cause**: Different environments (browser vs Node.js) require different globals

**Solution**: Already configured! Check `eslint.config.js` for separate configs

### Need Help?

Check the server console output for detailed error messages. The health endpoint at `http://localhost:3001/health` will show if your API key is configured.

## 🎯 Features

- 🤖 **Real AI Responses**: Powered by Claude (Anthropic)
- 📊 **Visual Phase Progression**: See the agent's thinking process
- 🛠️ **Tool Usage Tracking**: Monitor which tools the agent uses
- 💬 **Interactive Chat Interface**: Natural conversation flow
- 📝 **Code Formatting**: Syntax-highlighted code blocks
- 🎨 **Modern UI**: Clean, responsive design
- ⚡ **Fast Development**: Vite HMR for instant updates
- 🔒 **Secure API Key Management**: Server-side storage

## 📚 Component Documentation

### Core Components

#### `<Header />`
Displays the application title and tagline.

#### `<PhaseIndicator />`
Visualizes the current development phase (Analyzing, Architecting, Implementing, Testing, Documenting).

**Props:**
- `agentPhase` (string): Current active phase

#### `<ToolsPanel />`
Shows the tools being used by the agent.

**Props:**
- `toolsUsed` (array): List of tool identifiers

#### `<ChatMessage />`
Renders a single message in the chat.

**Props:**
- `message` (object): Message object with `role` and `content`

#### `<InputArea />`
User input field and send button.

**Props:**
- `input` (string): Current input value
- `setInput` (function): Input change handler
- `isLoading` (boolean): Loading state
- `onSend` (function): Send message handler

### Custom Hooks

#### `useAgentChat()`
Manages the entire chat state and logic.

**Returns:**
```javascript
{
  messages: Array,      // Chat message history
  input: String,        // Current input value
  setInput: Function,   // Input setter
  isLoading: Boolean,   // Loading state
  agentPhase: String,   // Current phase
  toolsUsed: Array,     // Tools being used
  sendMessage: Function // Send message handler
}
```

#### `useScrollToBottom(dependency)`
Auto-scrolls to bottom when dependency changes.

**Parameters:**
- `dependency`: Value to watch for changes

**Returns:**
- `ref`: Ref to attach to scroll target element

## 🎨 Customization

### Adding New Phases

1. Update `PHASES` in `src/constants/agentConstants.js`
2. Add phase configuration in `PHASE_CONFIGS`
3. Component will automatically adapt

### Adding New Tools

1. Add tool to `TOOL_DESCRIPTIONS` in `src/constants/agentConstants.js`
2. Include in phase configurations as needed

### Changing AI Model

Edit `src/constants/agentConstants.js`:
```javascript
export const API_CONFIG = {
  MODEL: 'claude-sonnet-4-20250514', // Change this
  MAX_TOKENS: 2000,
  // ...
}
```

Available models:
- `claude-sonnet-4-20250514` (recommended)
- `claude-3-5-sonnet-20241022`
- `claude-3-opus-20240229`

### Styling

The application uses inline styles for simplicity. To use CSS modules or styled-components:

1. Install your preferred styling solution
2. Create style files in a `/styles` directory
3. Import and apply to components

## 🧪 Testing

To add tests:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Create test files alongside components:
```
components/
  Header.jsx
  Header.test.jsx
```

## 📋 Best Practices Implemented

✅ **Separation of Concerns**: Each layer has a single responsibility  
✅ **DRY Principle**: Reusable components and utilities  
✅ **Single Responsibility**: Each component/function does one thing  
✅ **Composition over Inheritance**: React component composition  
✅ **Pure Functions**: Utilities are side-effect free  
✅ **Encapsulation**: State managed in custom hooks  
✅ **Modularity**: Easy to test and maintain  
✅ **Secure API Management**: Server-side key storage
✅ **Error Handling**: Comprehensive error handling throughout

## 🔄 Development History

This project was reengineered from a single monolithic React component into a production-ready application with:

1. ✅ Clean layered architecture (5 layers: components, hooks, services, utils, constants)
2. ✅ Independent backend proxy server for secure API communication
3. ✅ Unified development workflow (single command to start)
4. ✅ Real AI responses (not mocks)
5. ✅ Proper error handling and validation
6. ✅ ESLint configuration for both browser and Node.js code
7. ✅ All original functionality preserved and enhanced

## 🎯 Technology Stack

**Frontend:**
- React 18
- Vite (build tool)
- Modern ES6+ JavaScript

**Backend:**
- Express.js
- Anthropic SDK
- CORS middleware
- dotenv for environment management

**Development:**
- ESLint for code quality
- Concurrently for running multiple servers
- Hot Module Replacement (HMR)

---

**Built with React + Vite | Powered by Claude (Anthropic)**
