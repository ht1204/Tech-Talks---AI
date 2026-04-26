/**
 * InputArea Component
 * Handles user input and message submission
 */

const InputArea = ({ input, setInput, isLoading, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div style={{
      background: '#1e293b',
      borderTop: '1px solid #334155',
      padding: '16px'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe what you want to build, fix, or improve..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            opacity: isLoading || !input.trim() ? 0.5 : 1
          }}
        >
          {isLoading ? '⏳ Building...' : 'Send →'}
        </button>
      </div>
    </div>
  );
};

export default InputArea;
