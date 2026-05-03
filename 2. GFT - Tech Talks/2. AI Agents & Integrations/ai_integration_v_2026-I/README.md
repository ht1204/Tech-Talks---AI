# AI Integration
This project, **AI Integration**, is a lightweight application that demonstrates the integration of multiple AI models, including Claude, with a user-friendly browser-based interface. The project consists of:

1. **Frontend**: Built using HTML, CSS, and JavaScript. It provides a clean and simple UI that allows users to input text, select an AI model, and receive responses.
2. **Backend (AI Backend)**: A Node.js server that acts as a proxy to communicate with the Claude AI model or other AI APIs.

---

## **Frontend (UI)**

The frontend provides a clean and interactive interface:

- A **text input** where users can type their prompts.
- A **select dropdown** that allows users to switch between different AI models (e.g., GPT, Claude).
- A **send button** to submit the prompt.
- A **response display area** where the AI's reply is shown.

### **How to Run the Frontend**
1. Open the project in your IDE (e.g., VS Code).
2. Launch the `index.html` file:
   - Use a browser to open the file directly.
   - Or use an extension like **Live Server** in VS Code for dynamic reloading.
3. Ensure the backend server is running (see instructions below) for API communication.

---

## **Backend (AI Backend)**

The backend is built using **Node.js** and acts as a proxy to communicate with the Claude AI service. It provides a single endpoint for sending user prompts to the AI model and returning the AI's response.

### **Features**
- Handles requests from the frontend and forwards them to the selected AI model (currently supports Claude).
- Enables secure API communication using environment variables.

### **How to Run the Backend**
1. Navigate to the `ai-backend` directory:
   ```bash
    cd code_projects/ai_integration/ai-backend
   ```
2. Read the instructions in its README file.

### **How to Extend**
Go to file `config.js` and fill the object props according to AI model services:
 - GPT: add apiKey and model.
 - Claude: add backend URL local server to integrate with ClaudeAI

