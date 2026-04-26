import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; 

// Endpoint for Claude API Proxy
app.post("/api/claude", async (req, res) => {
    const { prompt } = req.body;
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    const CLAUDE_ENDPOINT = process.env.CLAUDE_ENDPOINT;
    const anthropic_version = process.env.ANTHROPIC_VERSION;
    const model = process.env.MODEL;

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
