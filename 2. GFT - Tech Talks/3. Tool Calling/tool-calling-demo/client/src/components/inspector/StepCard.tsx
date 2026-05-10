import type { ToolCallStep } from '../../types/index';
import { STEP_COLORS } from '../../types/index';
import Badge from '../ui/Badge';
import JsonViewer from '../ui/JsonViewer';

interface StepCardProps {
  step: ToolCallStep;
  isLatest: boolean;
}

const TYPE_ICONS: Record<ToolCallStep['type'], string> = {
  user_message: '💬',
  tool_definitions: '📋',
  llm_decision: '🤖',
  tool_execution: '⚙️',
  tool_result: '📨',
  final_response: '✅',
};

export default function StepCard({ step, isLatest }: StepCardProps) {
  const colors = STEP_COLORS[step.type];

  return (
    <div
      className={`
        rounded-xl border ${colors.border} ${colors.bg}
        overflow-hidden transition-all duration-500
        ${isLatest ? 'ring-2 ring-white/10 shadow-lg' : 'opacity-90'}
      `}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{TYPE_ICONS[step.type]}</span>
            <Badge stepNumber={step.step} label={step.label} colorClass={colors.badge} />
          </div>
          {isLatest && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              Current
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-400 leading-relaxed ml-8">
          {step.description}
        </p>

        <div className="ml-8">
          <JsonViewer data={step.data} defaultExpanded={step.type === 'tool_execution' || step.type === 'llm_decision'} />
        </div>
      </div>
    </div>
  );
}
