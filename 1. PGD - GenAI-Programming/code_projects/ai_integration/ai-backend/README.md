# **AI Backend**

## **Features**

- Enables **CORS** for all origins to allow cross-origin requests.
- Handles JSON request bodies for easy integration with frontend applications.
- Secure communication with any AI model service API using environment variables.
- Check the claude API service documentation to custom the server configuration integration.
---

## **Project Structure**

The main functionality is encapsulated in the following:
- **Endpoint**: `/api/claude`
  - Accepts a `POST` request with a user-provided prompt.
  - Connects to the Claude API using the configured endpoint and API key.
  - Returns the AI's response in JSON format.

---

## **Getting Started**

1. **Node.js** installed on your system (v18+ recommended).
2. A Claude API key and endpoint (provided by Anthropic).
3. Feel free to add others AI model service integrations.
4. Install dependencies: `npm install`
5. Create a .env file in the root directory and add the following:
```
    CLAUDE_API_KEY=your-claude-api-key
    CLAUDE_ENDPOINT=https://api.anthropic.com/v1/messages
    PORT=5000
    ANTHROPIC_VERSION=anthropic-version
    MODEL=AI_MODEL_CLAUDE
```
6. Run server: `npm start`


