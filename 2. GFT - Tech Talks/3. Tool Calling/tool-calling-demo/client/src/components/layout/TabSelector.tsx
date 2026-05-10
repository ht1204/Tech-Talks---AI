import type { Scenario, ScenarioConfig } from '../../types/index';

const TABS: ScenarioConfig[] = [
  {
    id: 'weather',
    label: 'Weather Lookup',
    icon: '🌤️',
    placeholder: '',
    examples: [],
    color: 'sky',
  },
  {
    id: 'calculator',
    label: 'Calculator',
    icon: '🧮',
    placeholder: '',
    examples: [],
    color: 'violet',
  },
];

interface TabSelectorProps {
  activeTab: Scenario;
  onTabChange: (tab: Scenario) => void;
}

export default function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex gap-2 px-4 sm:px-6 py-3 bg-gray-900/40 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto w-full flex gap-2">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
