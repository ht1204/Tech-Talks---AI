import { useState, useRef, useEffect } from 'react';
import type { Scenario } from './types/index';
import { SCENARIO_CONFIGS } from './types/index';
import { useChat } from './hooks/useChat';
import Header from './components/layout/Header';
import TabSelector from './components/layout/TabSelector';
import ChatInput from './components/chat/ChatInput';
import WeatherModeToggle from './components/chat/WeatherModeToggle';
import StepInspector from './components/inspector/StepInspector';
import FlowDiagram from './components/inspector/FlowDiagram';

export default function App() {
  const [activeTab, setActiveTab] = useState<Scenario>('weather');
  const { chatHistory, isLoading, error, weatherMode, setWeatherMode, sendMessage, clearHistory, getRevealedSteps, isAnimating } = useChat();
  const config = SCENARIO_CONFIGS[activeTab];
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredHistory = chatHistory.filter(entry => entry.scenario === activeTab);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredHistory, chatHistory]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header />
      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'weather' && (
        <WeatherModeToggle mode={weatherMode} onModeChange={setWeatherMode} />
      )}

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredHistory.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <div className="text-5xl">{config.icon}</div>
                <h2 className="text-xl font-semibold text-gray-300">
                  {config.label}
                </h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Ask a question below. The step-by-step inspector will show you
                  exactly how Tool Calling works — from the initial message to the
                  final response, with every JSON payload visible.
                </p>
                {activeTab === 'weather' && (
                  <p className="text-xs text-gray-600">
                    Current mode: <span className={weatherMode === 'live' ? 'text-sky-400' : 'text-amber-400'}>
                      {weatherMode === 'live' ? 'Live API (OpenWeatherMap)' : 'Mock Data (simulated)'}
                    </span>
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {config.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(ex, activeTab)}
                      className="px-3 py-2 text-xs text-gray-400 bg-gray-800/50 border border-gray-700/50
                                 rounded-lg hover:bg-gray-700/50 hover:text-gray-200
                                 transition-all duration-150 cursor-pointer"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredHistory.map(entry => {
              const steps = getRevealedSteps(entry.id);
              const animating = isAnimating(entry.id);
              const completedTypes = new Set(steps.map(s => s.type));

              return (
                <div key={entry.id} className="space-y-6">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 bg-blue-600/80 rounded-2xl rounded-br-md text-sm text-white">
                      {entry.userMessage}
                    </div>
                  </div>

                  <FlowDiagram completedTypes={completedTypes} />

                  <StepInspector steps={steps} isAnimating={animating} />

                  {entry.response.finalMessage && !animating && (
                    <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">🤖</span>
                        <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                          Final Answer
                        </span>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {entry.response.finalMessage}
                      </p>
                    </div>
                  )}

                  <div className="border-b border-gray-800/50" />
                </div>
              );
            })}

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">⚠️</span>
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Error</span>
                </div>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2 border-t border-gray-800/50 bg-gray-900/40 flex items-center justify-between">
        <span className="text-[10px] text-gray-600">
          {chatHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              Clear history
            </button>
          )}
        </span>
        <span className="text-[10px] text-gray-600">
          OpenAI GPT-4o &middot; Tool Calling Demo &middot; Tech Talk
        </span>
      </div>

      <ChatInput
        scenario={activeTab}
        config={config}
        isLoading={isLoading}
        onSend={sendMessage}
      />
    </div>
  );
}
