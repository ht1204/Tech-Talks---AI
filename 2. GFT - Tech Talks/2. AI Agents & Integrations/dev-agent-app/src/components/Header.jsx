/**
 * Header Component
 * Displays the application title and description
 */

const Header = () => {
  return (
    <div style={{
      background: 'linear-gradient(to right,#059669,#0d9488,#0891b2)',
      padding: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
        💻 AI Software Development Agent
      </h1>
      <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
        Demonstrating AI Agent capabilities for coding tasks
      </p>
    </div>
  );
};

export default Header;
