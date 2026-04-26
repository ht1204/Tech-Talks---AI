/**
 * Agent Constants
 * Contains all static configuration for the AI Development Agent
 */

export const DEV_AGENT_SYSTEM_PROMPT = `You are an AI Software Development Agent. You help developers by:

1. UNDERSTANDING their coding requirements and goals
2. ARCHITECTING solutions with proper design patterns
3. IMPLEMENTING clean, well-structured code
4. TESTING and debugging to ensure quality
5. DOCUMENTING for maintainability

## Your Tools (Capabilities):
- ANALYZE_CODE: Parse and understand existing code
- WRITE_CODE: Generate new code files or snippets
- EXECUTE_CODE: Run code and show output
- DEBUG_CODE: Identify issues and suggest fixes
- SEARCH_DOCS: Find relevant documentation
- REFACTOR_CODE: Improve code quality
- GENERATE_TESTS: Create unit tests
- EXPLAIN_CODE: Add documentation and comments

## Response Format:
ALWAYS structure your response like this:

**🎯 Understanding Your Request:**
[Summarize the coding task in 1-2 sentences]

**🏗️ My Approach:**
[List 2-4 numbered steps you'll take]

**🔧 Tools Used:**
[List which tools you're using: ANALYZE_CODE, WRITE_CODE, etc.]

**💻 Implementation:**
[Provide the code in a code block]

**🧪 Testing/Validation:**
[Show how to test or validate the code]

**📝 Explanation:**
[Brief explanation of key decisions]

## Code Quality Rules:
- Write clean, readable code with proper naming
- Include error handling where appropriate
- Add inline comments for complex logic
- Follow language-specific best practices
- Suggest tests for critical functionality

## Behavior:
- Ask clarifying questions if requirements are unclear
- Explain your reasoning and design decisions
- Be explicit about trade-offs
- Show your thinking process`;

export const PHASES = [
  { id: 'analyzing', icon: '🔍', label: 'Analyzing' },
  { id: 'planning', icon: '🏗️', label: 'Architecting' },
  { id: 'coding', icon: '💻', label: 'Implementing' },
  { id: 'testing', icon: '🧪', label: 'Testing' },
  { id: 'documenting', icon: '📚', label: 'Documenting' }
];

export const EXAMPLE_PROMPTS = [
  "Create a Python function to validate email addresses with unit tests",
  "Build a React hook for managing form state with validation",
  "Write a REST API endpoint in Node.js for user authentication",
  "Debug this: for i in range(10) print(i)",
  "Refactor: fetch(url).then(r => r.json()).then(console.log)"
];

export const TOOL_DESCRIPTIONS = {
  'analyze_code': '🔍 Analyzing',
  'write_code': '✍️ Writing',
  'execute_code': '▶️ Running',
  'debug_code': '🐛 Debugging',
  'search_docs': '📖 Searching',
  'refactor_code': '♻️ Refactoring',
  'generate_tests': '🧪 Testing',
  'explain_code': '💬 Documenting'
};

export const PHASE_CONFIGS = {
  'create': [
    { phase: 'analyzing', delay: 500, tools: ['analyze_code'] },
    { phase: 'planning', delay: 700, tools: ['search_docs'] },
    { phase: 'coding', delay: 1200, tools: ['write_code'] },
    { phase: 'testing', delay: 800, tools: ['generate_tests'] },
    { phase: 'documenting', delay: 400, tools: ['explain_code'] }
  ],
  'debug': [
    { phase: 'analyzing', delay: 600, tools: ['analyze_code'] },
    { phase: 'testing', delay: 800, tools: ['execute_code'] },
    { phase: 'coding', delay: 1000, tools: ['debug_code'] }
  ],
  'refactor': [
    { phase: 'analyzing', delay: 700, tools: ['analyze_code'] },
    { phase: 'planning', delay: 500, tools: ['search_docs'] },
    { phase: 'coding', delay: 1000, tools: ['refactor_code'] }
  ],
  'default': [
    { phase: 'analyzing', delay: 500, tools: ['analyze_code'] },
    { phase: 'coding', delay: 1000, tools: ['write_code'] },
    { phase: 'testing', delay: 500, tools: ['execute_code'] }
  ]
};

export const API_CONFIG = {
  // Use proxy server to avoid CORS issues
  url: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/chat',
  model: 'claude-sonnet-4-20250514',
  maxTokens: 8000
};
