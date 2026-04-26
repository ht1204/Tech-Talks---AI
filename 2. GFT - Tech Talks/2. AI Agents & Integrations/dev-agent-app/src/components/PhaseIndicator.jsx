/**
 * PhaseIndicator Component
 * Visualizes the current phase of the AI agent's work
 */

import { PHASES } from '../constants/agentConstants';

const PhaseIndicator = ({ agentPhase }) => {
  return (
    <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px', margin: '0 auto' }}>
        {PHASES.map((phase, idx) => {
          const isActive = agentPhase === phase.id;
          const isCompleted = PHASES.findIndex(p => p.id === agentPhase) > idx;
          
          return (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  background: isActive ? '#10b981' : isCompleted ? '#059669' : '#334155',
                  color: isActive || isCompleted ? 'white' : '#64748b',
                  boxShadow: isActive ? '0 0 20px rgba(16,185,129,0.4)' : 'none'
                }}>
                  {isCompleted ? '✓' : phase.icon}
                </div>
                <span style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  color: isActive ? '#34d399' : isCompleted ? '#10b981' : '#64748b'
                }}>
                  {phase.label}
                </span>
              </div>
              {idx < PHASES.length - 1 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  margin: '0 8px',
                  background: isCompleted ? '#10b981' : '#334155',
                  borderRadius: '2px'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseIndicator;
