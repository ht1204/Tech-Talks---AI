const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const aiDropdown = document.getElementById("ai-dropdown");

function populateDropdown(config, defaultKey = "gpt") {
    Object.entries(config).forEach(([key, { label }]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = label;
        aiDropdown.appendChild(option);
    });
    aiDropdown.value = defaultKey;
}

function displayMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearInput() {
    userInput.value = "";
}

function getInputValue() {
    return userInput.value.trim();
}
