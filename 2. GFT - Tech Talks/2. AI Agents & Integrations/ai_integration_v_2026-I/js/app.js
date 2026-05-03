populateDropdown(AI_CONFIG, "gpt");

let selectedAI = aiDropdown.value;

aiDropdown.addEventListener("change", () => {
    selectedAI = aiDropdown.value;
    displayMessage(`Switched to ${selectedAI.toUpperCase()} model.`, "system");
});

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {
    const message = getInputValue();
    if (!message) return;

    displayMessage(message, "user");
    clearInput();

    try {
        const aiResponse = await getAIResponse(message, selectedAI);
        displayMessage(aiResponse, "ai");
    } catch (error) {
        displayMessage("Error: Unable to connect to AI", "ai");
        console.error("Error fetching AI response:", error);
    }
}
