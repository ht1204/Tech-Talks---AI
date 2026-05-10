import type { ToolCallStep } from '../../types/index';
import StepCard from './StepCard';

interface StepInspectorProps {
  steps: ToolCallStep[];
  isAnimating: boolean;
}

export default function StepInspector({ steps, isAnimating }: StepInspectorProps) {
  if (steps.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Tool Calling Flow
        </h3>
        <div className="flex items-center gap-2">
          {isAnimating && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing steps...
            </span>
          )}
          <span className="text-xs text-gray-500">{steps.length} steps</span>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.step}>
            <StepCard step={step} isLatest={index === steps.length - 1 && isAnimating} />
            {index < steps.length - 1 && (
              <div className="flex justify-center py-1.5">
                <div className="w-px h-4 bg-gray-600/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
