/**
 * ChatMessage Component
 * Displays a single chat message (user or assistant)
 */

import { formatMessage } from '../utils/formatters';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px'
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '16px',
        borderRadius: '12px',
        background: isUser ? '#059669' : '#1e293b',
        border: isUser ? 'none' : '1px solid #334155'
      }}>
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #334155'
          }}>
            <span>🤖</span>
            <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '500' }}>
              Dev Agent
            </span>
          </div>
        )}
        <div
          style={{ fontSize: '14px', lineHeight: '1.6' }}
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;
