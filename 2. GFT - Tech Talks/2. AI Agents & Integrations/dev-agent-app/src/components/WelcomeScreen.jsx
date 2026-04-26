/**
 * WelcomeScreen Component
 * Displays welcome message and example prompts
 */

import { EXAMPLE_PROMPTS } from '../constants/agentConstants';

const WelcomeScreen = ({ onPromptSelect }) => {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
      <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
        AI-Powered Development Assistant
      </h2>
      <p style={{
        color: '#94a3b8',
        marginBottom: '24px',
        maxWidth: '500px',
        margin: '0 auto 24px'
      }}>
        Watch how an AI agent handles coding tasks through: analyzing, architecting,
        implementing, testing, and documenting.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: '8px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {EXAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onPromptSelect(prompt)}
            style={{
              padding: '12px',
              textAlign: 'left',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.borderColor = '#10b981'}
            onMouseOut={e => e.target.style.borderColor = '#334155'}
          >
            <span style={{ color: '#10b981' }}>→</span> {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
