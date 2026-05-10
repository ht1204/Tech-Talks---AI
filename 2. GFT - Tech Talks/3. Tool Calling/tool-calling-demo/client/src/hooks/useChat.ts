import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';
import type { Scenario, ChatEntry, ToolCallStep, WeatherMode } from '../types/index';

export function useChat() {
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<Record<string, number>>({});
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('mock');

  const sendMessage = useCallback(async (message: string, scenario: Scenario) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const mode = scenario === 'weather' ? weatherMode : undefined;

    try {
      const response = await sendChatMessage(message.trim(), scenario, mode);

      const entry: ChatEntry = {
        id,
        scenario,
        userMessage: message.trim(),
        response,
        timestamp: Date.now(),
      };

      setChatHistory(prev => [...prev, entry]);
      animateSteps(id, response.steps.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, weatherMode]);

  const animateSteps = (entryId: string, totalSteps: number) => {
    setRevealedSteps(prev => ({ ...prev, [entryId]: 0 }));

    for (let i = 1; i <= totalSteps; i++) {
      setTimeout(() => {
        setRevealedSteps(prev => ({ ...prev, [entryId]: i }));
      }, i * 600);
    }
  };

  const clearHistory = useCallback(() => {
    setChatHistory([]);
    setRevealedSteps({});
    setError(null);
  }, []);

  const getRevealedSteps = useCallback((entryId: string): ToolCallStep[] => {
    const entry = chatHistory.find(e => e.id === entryId);
    if (!entry) return [];
    const count = revealedSteps[entryId] || 0;
    return entry.response.steps.slice(0, count);
  }, [chatHistory, revealedSteps]);

  const isAnimating = useCallback((entryId: string): boolean => {
    const entry = chatHistory.find(e => e.id === entryId);
    if (!entry) return false;
    return (revealedSteps[entryId] || 0) < entry.response.steps.length;
  }, [chatHistory, revealedSteps]);

  return {
    chatHistory,
    isLoading,
    error,
    weatherMode,
    setWeatherMode,
    sendMessage,
    clearHistory,
    getRevealedSteps,
    isAnimating,
  };
}
