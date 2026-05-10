import type { WeatherMode } from '../../types/index';

interface WeatherModeToggleProps {
  mode: WeatherMode;
  onModeChange: (mode: WeatherMode) => void;
}

export default function WeatherModeToggle({ mode, onModeChange }: WeatherModeToggleProps) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 bg-gray-900/30 border-b border-gray-800/30">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        <span className="text-xs text-gray-500 font-medium">Data source:</span>
        <div className="flex bg-gray-800/60 rounded-lg p-0.5 border border-gray-700/40">
          <button
            onClick={() => onModeChange('mock')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              mode === 'mock'
                ? 'bg-amber-600/80 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🗂️ Mock Data
          </button>
          <button
            onClick={() => onModeChange('live')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              mode === 'live'
                ? 'bg-sky-600/80 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🌐 Live API
          </button>
        </div>
        {mode === 'live' && (
          <span className="text-[10px] text-sky-400/70">
            Uses OpenWeatherMap API — requires OPENWEATHER_API_KEY in .env
          </span>
        )}
        {mode === 'mock' && (
          <span className="text-[10px] text-amber-400/70">
            Uses simulated data — no API key needed
          </span>
        )}
      </div>
    </div>
  );
}
