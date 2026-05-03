const OPENAI_COMPATIBLE = ["gpt", "deepseek", "glm"];

const AI_CONFIG = {
    gpt: {
        label: "GPT",
        endpoint: api_configs.gpt.endpoint,
    },
    claude: {
        label: "Claude",
        endpoint: api_configs.claude.endpoint,
    },
    deepseek: {
        label: "DeepSeek",
        endpoint: api_configs.deepseek.endpoint,
    },
    glm: {
        label: "GLM",
        endpoint: api_configs.glm.endpoint,
    },
    other: {
        label: "Other",
        apiKey: "YOUR_OTHER_AI_API_KEY",
        endpoint: "https://other-ai.com/api",
        model: "other-model"
    }
};

async function getAIResponse(prompt, selectedAI) {
    const aiConfig = AI_CONFIG[selectedAI];
    const { endpoint, model } = aiConfig;

    let requestBody, headerBody = {};
    if (OPENAI_COMPATIBLE.includes(selectedAI)) {
        requestBody = { prompt };
        headerBody = { "Content-Type": "application/json" };
    } else if (selectedAI === "claude") {
        requestBody = { prompt };
        headerBody = { "Content-Type": "application/json" };
    } else if (selectedAI === "other") {
        requestBody = { model, input: prompt };
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers: headerBody,
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (OPENAI_COMPATIBLE.includes(selectedAI) && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else if (selectedAI === "claude" && data.content) {
        return data.content[0].text.trim();
    } else if (selectedAI === "other" && data.result) {
        return data.result.trim();
    } else {
        throw new Error("Unexpected response structure.");
    }
}
