export default function Header() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl">🔧</div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Tool Calling Demo
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Step-by-step visualization of OpenAI function calling
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">Node.js</span>
          <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">TypeScript</span>
          <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">React</span>
          <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">OpenAI</span>
        </div>
      </div>
    </header>
  );
}
