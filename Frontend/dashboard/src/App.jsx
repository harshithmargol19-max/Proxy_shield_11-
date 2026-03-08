import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { IdentityProvider } from './context/IdentityContext';
import { ThreatProvider } from './context/ThreatContext';
import { SmsProvider } from './context/SmsContext';
import { RotationProvider } from './context/RotationContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { ActivityProvider } from './context/ActivityContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import IdentityControlCenter from './pages/IdentityControlCenter';
import ThreatPanel from './pages/ThreatPanel';
import RotationPanel from './pages/RotationPanel';
import InboxPanel from './pages/InboxPanel';
import BlockchainPanel from './pages/BlockchainPanel';
import ActivityPanel from './pages/ActivityPanel';
import SettingsPanel from './pages/SettingsPanel';
import AttackSimulator from './pages/AttackSimulator';
import SignIn from './pages/SignIn';
import { Shield, AlertTriangle, RotateCw, Inbox, Link as LinkIcon, Activity, Settings, LogOut, Zap } from 'lucide-react';
import './index.css';

// Protected Route wrapper - redirects to sign-in if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
}

function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const mainPages = [
    { path: '/', label: 'Identities', icon: Shield },
    { path: '/threats', label: 'Threats', icon: AlertTriangle },
    { path: '/activity', label: 'Activity', icon: Activity },
  ];

  const dataPages = [
    { path: '/inbox', label: 'Inbox', icon: Inbox },
    { path: '/rotations', label: 'Rotations', icon: RotateCw },
    { path: '/blockchain', label: 'Blockchain', icon: LinkIcon },
    { path: '/attack-simulator', label: 'Attack Sim', icon: Zap },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

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
            <div className="w-px h-6 bg-gray-200 mx-1" />
            {/* User Info & Sign Out */}
            <div className="flex items-center gap-2 ml-2">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">
                    {user?.isAnonymous ? 'G' : (user?.displayName?.[0] || user?.email?.[0] || '?')}
                  </span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Sign In */}
      <Route 
        path="/signin" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />} 
      />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <IdentityControlCenter />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/threats" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <ThreatPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/activity" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <ActivityPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/inbox" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <InboxPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/rotations" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <RotationPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/blockchain" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <BlockchainPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <SettingsPanel />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/attack-simulator" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <AttackSimulator />
          </div>
        </ProtectedRoute>
      } />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <IdentityProvider>
          <ThreatProvider>
            <SmsProvider>
              <RotationProvider>
                <BlockchainProvider>
                  <ActivityProvider>
                    <SettingsProvider>
                      <AppRoutes />
                    </SettingsProvider>
                  </ActivityProvider>
                </BlockchainProvider>
              </RotationProvider>
            </SmsProvider>
          </ThreatProvider>
        </IdentityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
