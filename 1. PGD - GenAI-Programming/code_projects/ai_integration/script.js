// Select elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const aiDropdown = document.getElementById("ai-dropdown");

// AI Integration Configurations
const AI_CONFIG = {
    gpt: {
        apiKey: api_configs.gpt.apiKey,
        endpoint: "https://api.openai.com/v1/chat/completions",
        model: api_configs.gpt.model,
    },
    claude: {
        apiKey: null,
        endpoint: api_configs.claude.endpoint,
        model: "",
    },
    other: {
        apiKey: "YOUR_OTHER_AI_API_KEY", // Replace with another AI API key
        endpoint: "https://other-ai.com/api",
        model: "other-model"
    }
};

// Current AI Model (default: GPT)
let selectedAI = "gpt";

// Handle dropdown change
aiDropdown.addEventListener("change", () => {
    selectedAI = aiDropdown.value;
    displayMessage(`Switched to ${selectedAI.toUpperCase()} model.`, "system");
});

// Function to handle sending messages
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user's message
    displayMessage(message, "user");
    userInput.value = "";

    // Fetch AI response
    try {
        const aiResponse = await getAIResponse(message);
        displayMessage(aiResponse, "ai");
    } catch (error) {
        displayMessage("Error: Unable to connect to AI", "ai");
        console.error("Error fetching AI response:", error);
    }
}

// Function to display messages in the chatbox
function displayMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Function to fetch response from AI model
async function getAIResponse(prompt) {
    const aiConfig = AI_CONFIG[selectedAI];
    const { apiKey, endpoint, model } = aiConfig;

    // Prepare request body
    let requestBody, headerBody = {};
    if (selectedAI === "gpt") {
        requestBody = {
            model,
            messages: [
                { role: "system", content: "You are an AI assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 1,
            top_p: 0.9,
        };
        headerBody = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    } else if (selectedAI === "claude") {
        requestBody = { prompt };
        headerBody = {
            "Content-Type": "application/json",
        } 
    } else if (selectedAI === "other") {
        requestBody = {
            model,
            input: prompt
        };
    }

    // Send API request
    const response = await fetch(endpoint, {
        method: "POST",
        headers: headerBody,
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Parse response
    if (selectedAI === "gpt" && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else if (selectedAI === "claude" && data.content) {
        return data.content[0].text.trim();
    } else if (selectedAI === "other" && data.result) {
        return data.result.trim();
    } else {
        throw new Error("Unexpected response structure.");
    }
}

// Add Enter key event listener for input
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
