/*
GPT & Claude:
    - Both proxied through backend server
    - API keys stored in ai-backend/.env
*/

api_configs = {
    gpt: {
        endpoint: "http://localhost:5000/api/gpt",
    },
    claude: {
        endpoint: "http://localhost:5000/api/claude",
    },
    deepseek: {
        endpoint: "http://localhost:5000/api/deepseek",
    },
    glm: {
        endpoint: "http://localhost:5000/api/glm",
    }
}
  