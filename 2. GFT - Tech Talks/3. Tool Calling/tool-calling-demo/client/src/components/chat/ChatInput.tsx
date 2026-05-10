import { useState, type KeyboardEvent } from 'react';
import type { Scenario, ScenarioConfig } from '../../types/index';

interface ChatInputProps {
  scenario: Scenario;
  config: ScenarioConfig;
  isLoading: boolean;
  onSend: (message: string, scenario: Scenario) => void;
}

export default function ChatInput({ scenario, config, isLoading, onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim(), scenario);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExample = (example: string) => {
    onSend(example, scenario);
  };

  return (
    <div className="border-t border-gray-700/50 bg-gray-900/60 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={config.placeholder}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600/50 rounded-xl
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500
                       text-white rounded-xl text-sm font-medium
                       transition-all duration-200 cursor-pointer
                       disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : 'Send'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500 self-center">Try:</span>
          {config.examples.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExample(example)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800/60 border border-gray-700/50
                         rounded-lg hover:bg-gray-700/60 hover:text-gray-200
                         transition-all duration-150 cursor-pointer
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
