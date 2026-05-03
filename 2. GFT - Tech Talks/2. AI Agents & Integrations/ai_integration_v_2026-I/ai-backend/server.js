import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

function openAICompatibleProxy(apiKey, endpoint, model) {
    return async (req, res) => {
        const { prompt } = req.body;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: "You are an AI assistant." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 1,
                    top_p: 0.9,
                }),
            });

            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error(`Error connecting to ${model} API:`, error);
            res.status(500).json({ error: `Error connecting to ${model} API` });
        }
    };
}

app.post("/api/gpt", openAICompatibleProxy(
    process.env.GPT_API_KEY,
    process.env.GPT_ENDPOINT,
    process.env.GPT_MODEL
));

app.post("/api/deepseek", openAICompatibleProxy(
    process.env.DEEPSEEK_API_KEY,
    process.env.DEEPSEEK_ENDPOINT,
    process.env.DEEPSEEK_MODEL
));

app.post("/api/glm", openAICompatibleProxy(
    process.env.GLM_API_KEY,
    process.env.GLM_ENDPOINT,
    process.env.GLM_MODEL
));

app.post("/api/claude", async (req, res) => {
    const { prompt } = req.body;
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    const CLAUDE_ENDPOINT = process.env.CLAUDE_ENDPOINT;
    const anthropic_version = process.env.ANTHROPIC_VERSION;
    const model = process.env.CLAUDE_MODEL;

    try {
        const response = await fetch(CLAUDE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": CLAUDE_API_KEY,
                "anthropic-version": anthropic_version,
            },
            body: JSON.stringify({
                system: "You are an AI assistant.",
                messages: [
                    { "role": "user", "content": prompt }
                ],
                model: model,
                max_tokens: 1000,
                temperature: 1,
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error connecting to Claude API:", error);
        res.status(500).json({ error: "Error connecting to Claude API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
