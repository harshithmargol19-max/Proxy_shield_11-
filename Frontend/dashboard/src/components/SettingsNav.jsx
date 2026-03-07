import { User, Monitor, Shield, Info } from 'lucide-react';

const SettingsNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'devices', label: 'Devices', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: Info },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsNav;
