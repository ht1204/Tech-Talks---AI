/**
 * ToolsPanel Component
 * Displays the tools currently being used by the agent
 */

import { TOOL_DESCRIPTIONS } from '../constants/agentConstants';

const ToolsPanel = ({ toolsUsed }) => {
  if (toolsUsed.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(16,185,129,0.1)',
      borderBottom: '1px solid #065f46',
      padding: '8px 16px'
    }}>
      <span style={{ color: '#34d399', fontSize: '13px', marginRight: '8px' }}>
        🛠️ Tools:
      </span>
      {[...new Set(toolsUsed)].map((tool, idx) => (
        <span
          key={idx}
          style={{
            background: '#064e3b',
            color: '#6ee7b7',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            marginRight: '6px',
            fontFamily: 'monospace'
          }}
        >
          {TOOL_DESCRIPTIONS[tool] || tool}
        </span>
      ))}
    </div>
  );
};

export default ToolsPanel;
