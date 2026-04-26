/**
 * Phase Simulation Service
 * Manages the visual progression through agent phases
 */

import { PHASE_CONFIGS } from '../constants/agentConstants';

/**
 * Simulates agent phases based on task type
 * @param {string} taskType - Type of task ('create', 'debug', 'refactor', 'default')
 * @param {Function} setAgentPhase - State setter for current phase
 * @param {Function} setToolsUsed - State setter for tools used
 * @returns {Promise<void>}
 */
export const simulatePhases = async (taskType, setAgentPhase, setToolsUsed) => {
  const phases = PHASE_CONFIGS[taskType] || PHASE_CONFIGS['default'];

  for (const { phase, delay, tools } of phases) {
    setAgentPhase(phase);
    setToolsUsed(prev => [...prev, ...tools]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};
