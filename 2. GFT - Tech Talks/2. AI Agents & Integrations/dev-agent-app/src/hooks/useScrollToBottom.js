/**
 * useScrollToBottom Hook
 * Auto-scrolls to bottom when messages change
 */

import { useEffect, useRef } from 'react';

export const useScrollToBottom = (dependency) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dependency]);

  return endRef;
};
