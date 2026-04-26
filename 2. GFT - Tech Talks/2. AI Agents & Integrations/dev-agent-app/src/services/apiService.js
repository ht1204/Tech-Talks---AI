/**
 * Claude API Service
 * Handles communication with the Claude API
 */

import { DEV_AGENT_SYSTEM_PROMPT, API_CONFIG } from '../constants/agentConstants';

/**
 * Sends a message to the Claude API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<string>} Assistant's response
 */
export const sendMessageToAPI = async (messages) => {
  try {
    const response = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: API_CONFIG.model,
        max_tokens: API_CONFIG.maxTokens,
        system: DEV_AGENT_SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const data = await response.json();
    return data.content?.[0]?.text || 'Error processing request.';
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Generates a demo mode response when API is unavailable
 * @param {string} userInput - User's input message
 * @returns {string} Demo response
 */
export const generateDemoResponse = (userInput) => {
  return `⚠️ **Demo Mode** - API simulated.

**🎯 Understanding Your Request:**
You want help with: "${userInput}"

**🏗️ My Approach:**
1. Analyze requirements
2. Design solution
3. Implement code
4. Test and validate

**🔧 Tools Used:**
\`ANALYZE_CODE\` → \`WRITE_CODE\` → \`EXECUTE_CODE\` → \`GENERATE_TESTS\`

**💻 Implementation:**
\`\`\`python
# In live demo, actual code appears here
def example_solution():
    """Your requested implementation"""
    pass
\`\`\`

**📝 Connect API for full functionality!**`;
};
