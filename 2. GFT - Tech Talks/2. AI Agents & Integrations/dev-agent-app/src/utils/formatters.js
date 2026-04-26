/**
 * Message Formatting Utilities
 * Handles conversion of markdown and code blocks to HTML
 */

/**
 * Escapes HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Formats message content with code blocks and markdown
 * @param {string} content - Raw message content
 * @returns {string} Formatted HTML
 */
export const formatMessage = (content) => {
  // Handle code blocks with language specification
  let formatted = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => 
    `<div style="background:#1e293b;border-radius:8px;margin:12px 0;border:1px solid #334155;overflow:hidden">
      <div style="background:#334155;padding:6px 12px;font-size:12px;color:#94a3b8;font-family:monospace">${lang || 'code'}</div>
      <pre style="padding:12px;margin:0;overflow-x:auto"><code style="font-family:Consolas,monospace;font-size:13px;color:#e2e8f0">${escapeHtml(code.trim())}</code></pre>
    </div>`
  );
  
  // Handle inline code
  formatted = formatted.replace(
    /`([^`]+)`/g, 
    '<code style="background:#334155;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;color:#10b981">$1</code>'
  );
  
  // Handle bold text
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g, 
    '<strong style="color:#5eead4">$1</strong>'
  );
  
  // Handle newlines
  return formatted.replace(/\n/g, '<br/>');
};
