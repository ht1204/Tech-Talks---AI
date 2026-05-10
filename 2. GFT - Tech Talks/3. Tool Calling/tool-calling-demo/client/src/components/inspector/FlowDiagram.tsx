const FLOW_STEPS = [
  { id: 'user', label: 'User Message', icon: '💬' },
  { id: 'tools', label: 'Tool Definitions', icon: '📋' },
  { id: 'decision', label: 'LLM Decision', icon: '🤖' },
  { id: 'execution', label: 'Tool Execution', icon: '⚙️' },
  { id: 'result', label: 'Tool Result', icon: '📨' },
  { id: 'final', label: 'Final Response', icon: '✅' },
];

interface FlowDiagramProps {
  completedTypes: Set<string>;
}

const TYPE_TO_FLOW: Record<string, string> = {
  user_message: 'user',
  tool_definitions: 'tools',
  llm_decision: 'decision',
  tool_execution: 'execution',
  tool_result: 'result',
  final_response: 'final',
};

export default function FlowDiagram({ completedTypes }: FlowDiagramProps) {
  const flowCompleted = new Set(
    Array.from(completedTypes).map(t => TYPE_TO_FLOW[t])
  );

  return (
    <div className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Flow Progress
      </h3>
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {FLOW_STEPS.map((step, i) => {
          const isCompleted = flowCompleted.has(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex flex-col items-center gap-1 min-w-[60px] transition-all duration-300
                ${isCompleted ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}
              `}>
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-blue-600/30 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800 border border-gray-700/50'
                  }
                `}>
                  {step.icon}
                </div>
                <span className={`
                  text-[10px] text-center leading-tight font-medium
                  ${isCompleted ? 'text-blue-300' : 'text-gray-600'}
                `}>
                  {step.label}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className={`
                  w-4 sm:w-8 h-px mx-0.5 transition-colors duration-300
                  ${isCompleted ? 'bg-blue-500/50' : 'bg-gray-700/50'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
