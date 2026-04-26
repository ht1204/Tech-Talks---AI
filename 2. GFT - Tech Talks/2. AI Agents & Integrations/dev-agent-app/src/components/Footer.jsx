/**
 * Footer Component
 * Displays demo information
 */

const Footer = () => {
  return (
    <div style={{
      background: 'rgba(16,185,129,0.1)',
      borderTop: '1px solid #065f46',
      padding: '12px 16px'
    }}>
      <p style={{
        margin: 0,
        fontSize: '13px',
        color: '#6ee7b7',
        textAlign: 'center'
      }}>
        <strong>🎓 Demo:</strong> Analyzing → Architecting → Implementing → Testing → Documenting
      </p>
    </div>
  );
};

export default Footer;
