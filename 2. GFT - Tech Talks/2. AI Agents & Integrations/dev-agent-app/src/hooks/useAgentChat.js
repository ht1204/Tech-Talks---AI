/**
 * useAgentChat Hook
 * Manages chat state and interactions with the AI agent
 */

import { useState } from 'react';
import { sendMessageToAPI, generateDemoResponse } from '../services/apiService';
import { simulatePhases } from '../services/phaseService';
import { detectTaskType } from '../utils/taskDetector';

export const useAgentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentPhase, setAgentPhase] = useState('idle');
  const [toolsUsed, setToolsUsed] = useState([]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setToolsUsed([]);

    // Simulate phase progression
    const taskType = detectTaskType(currentInput);
    simulatePhases(taskType, setAgentPhase, setToolsUsed);

    try {
      const assistantContent = await sendMessageToAPI([...messages, userMessage]);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantContent 
      }]);
    } catch {
      // Fallback to demo mode when API fails
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: generateDemoResponse(currentInput)
      }]);
    }

    setIsLoading(false);
    setAgentPhase('idle');
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    agentPhase,
    toolsUsed,
    sendMessage
  };
};
