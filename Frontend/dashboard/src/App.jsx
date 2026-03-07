import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { IdentityProvider } from './context/IdentityContext';
import { ThreatProvider } from './context/ThreatContext';
import { SmsProvider } from './context/SmsContext';
import { RotationProvider } from './context/RotationContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { ActivityProvider } from './context/ActivityContext';
import { SettingsProvider } from './context/SettingsContext';
import IdentityControlCenter from './pages/IdentityControlCenter';
import ThreatPanel from './pages/ThreatPanel';
import RotationPanel from './pages/RotationPanel';
import InboxPanel from './pages/InboxPanel';
import BlockchainPanel from './pages/BlockchainPanel';
import ActivityPanel from './pages/ActivityPanel';
import SettingsPanel from './pages/SettingsPanel';
import { Shield, AlertTriangle, RotateCw, Inbox, Link as LinkIcon, Activity, Settings } from 'lucide-react';
import './index.css';

function Navigation() {
  const location = useLocation();
  
  const mainPages = [
    { path: '/', label: 'Identities', icon: Shield },
    { path: '/threats', label: 'Threats', icon: AlertTriangle },
    { path: '/activity', label: 'Activity', icon: Activity },
  ];

  const dataPages = [
    { path: '/inbox', label: 'Inbox', icon: Inbox },
    { path: '/rotations', label: 'Rotations', icon: RotateCw },
    { path: '/blockchain', label: 'Blockchain', icon: LinkIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">ShieldMail</span>
          </div>
          <div className="flex items-center gap-1">
            {mainPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(page.path) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{page.label}</span>
                </Link>
              );
            })}
            <div className="w-px h-6 bg-gray-200 mx-1" />
            {dataPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(page.path) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{page.label}</span>
                </Link>
              );
            })}
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/settings') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <IdentityProvider>
      <ThreatProvider>
        <SmsProvider>
          <RotationProvider>
            <BlockchainProvider>
              <ActivityProvider>
                <SettingsProvider>
                  <Router>
                    <div className="min-h-screen bg-gray-100">
                      <Navigation />
                      <Routes>
                        <Route path="/" element={<IdentityControlCenter />} />
                        <Route path="/threats" element={<ThreatPanel />} />
                        <Route path="/activity" element={<ActivityPanel />} />
                        <Route path="/inbox" element={<InboxPanel />} />
                        <Route path="/rotations" element={<RotationPanel />} />
                        <Route path="/blockchain" element={<BlockchainPanel />} />
                        <Route path="/settings" element={<SettingsPanel />} />
                      </Routes>
                    </div>
                  </Router>
                </SettingsProvider>
              </ActivityProvider>
            </BlockchainProvider>
          </RotationProvider>
        </SmsProvider>
      </ThreatProvider>
    </IdentityProvider>
  );
}

export default App;
