/**
 * LoadingIndicator Component
 * Shows loading state while agent is processing
 */

const LoadingIndicator = ({ agentPhase }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        padding: '16px',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🤖</span>
          <span style={{ color: '#34d399', fontSize: '13px' }}>Dev Agent</span>
          <span style={{
            color: '#64748b',
            fontSize: '13px',
            marginLeft: '8px',
            textTransform: 'capitalize'
          }}>
            {agentPhase === 'idle' ? 'Processing' : agentPhase}...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
