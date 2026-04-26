/**
 * Task Type Detection Utilities
 * Analyzes user input to determine the type of development task
 */

/**
 * Detects the type of task based on message content
 * @param {string} message - User message
 * @returns {string} Task type: 'create', 'debug', 'refactor', or 'default'
 */
export const detectTaskType = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('debug') || 
      lowerMessage.includes('fix') || 
      lowerMessage.includes('error')) {
    return 'debug';
  }
  
  if (lowerMessage.includes('refactor') || 
      lowerMessage.includes('improve')) {
    return 'refactor';
  }
  
  if (lowerMessage.includes('create') || 
      lowerMessage.includes('build') || 
      lowerMessage.includes('write')) {
    return 'create';
  }
  
  return 'default';
};
