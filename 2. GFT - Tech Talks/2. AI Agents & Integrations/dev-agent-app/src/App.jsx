/**
 * DevAgentApp - Main Application Component
 * AI Software Development Agent with layered architecture
 */

import Header from './components/Header';
import PhaseIndicator from './components/PhaseIndicator';
import ToolsPanel from './components/ToolsPanel';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessage from './components/ChatMessage';
import LoadingIndicator from './components/LoadingIndicator';
import InputArea from './components/InputArea';
import Footer from './components/Footer';
import { useAgentChat } from './hooks/useAgentChat';
import { useScrollToBottom } from './hooks/useScrollToBottom';

function App() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    agentPhase,
    toolsUsed,
    sendMessage
  } = useAgentChat();

  const chatEndRef = useScrollToBottom(messages);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'system-ui,sans-serif'
    }}>
      <Header />
      <PhaseIndicator agentPhase={agentPhase} />
      <ToolsPanel toolsUsed={toolsUsed} />

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.length === 0 && <WelcomeScreen onPromptSelect={setInput} />}
        
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isLoading && <LoadingIndicator agentPhase={agentPhase} />}
        
        <div ref={chatEndRef} />
      </div>

      <InputArea
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSend={sendMessage}
      />
      <Footer />
    </div>
  );
}

export default App;
