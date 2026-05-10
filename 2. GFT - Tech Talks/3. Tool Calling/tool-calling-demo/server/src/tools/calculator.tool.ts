import type { ToolHandler } from '../types/index.js';

export const calculatorTool: ToolHandler = {
  definition: {
    name: 'calculate',
    description: 'Evaluates a mathematical expression and returns the result. Supports basic arithmetic (+, -, *, /), exponentiation (**), parentheses, and common math functions (sqrt, abs, round, floor, ceil, log, sin, cos, tan, PI, E).',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'The mathematical expression to evaluate, e.g. "347 * 29 + 1582", "Math.sqrt(144)", "3.14159 * 5 ** 2"',
        },
      },
      required: ['expression'],
    },
  },

  execute: async (args) => {
    const expression = args.expression as string;

    const allowedPattern = /^[0-9+\-*/().%\s,sqrtabsroundfloorceillog sincostanPIEe**]+$/;
    const sanitized = expression.replace(/Math\./g, '');

    if (!allowedPattern.test(sanitized)) {
      return {
        error: 'Invalid expression',
        expression,
        message: 'Expression contains disallowed characters. Only numbers, basic operators, and math functions are allowed.',
      };
    }

    try {
      const safeExpression = expression
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/round/g, 'Math.round')
        .replace(/floor/g, 'Math.floor')
        .replace(/ceil/g, 'Math.ceil')
        .replace(/log/g, 'Math.log')
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bPI\b/g, 'Math.PI')
        .replace(/\bE\b/g, 'Math.E')
        .replace(/Math\.Math\./g, 'Math.');

      const fn = new Function(`"use strict"; return (${safeExpression});`);
      const result = fn();

      if (typeof result !== 'number' || !isFinite(result)) {
        return {
          error: 'Invalid result',
          expression,
          message: 'Expression did not evaluate to a valid finite number.',
        };
      }

      return {
        expression,
        result: Number.isInteger(result) ? result : parseFloat(result.toFixed(10)),
      };
    } catch {
      return {
        error: 'Evaluation failed',
        expression,
        message: 'Could not evaluate the expression. Please check the syntax.',
      };
    }
  },
};
