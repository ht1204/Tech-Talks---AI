import { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  defaultExpanded?: boolean;
}

export default function JsonViewer({ data, defaultExpanded = false }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const jsonStr = JSON.stringify(data, null, 2);

  const highlightJson = (json: string): string => {
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-blue-400">$1</span>')
      .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>');
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200
                   transition-colors duration-150 cursor-pointer"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 6L14 10L6 14V6Z" />
        </svg>
        {expanded ? 'Hide JSON' : 'Show JSON'}
      </button>

      {expanded && (
        <pre className="mt-2 p-3 bg-black/40 rounded-lg border border-gray-700/30 overflow-x-auto
                        text-xs leading-relaxed font-mono">
          <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonStr) }} />
        </pre>
      )}
    </div>
  );
}
