import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMockUser } from '../services/mockSettingsData';
import { AccountStatus } from '../types/settings';

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMockUser();
      setUser(data);
      setEditedUser(data);
    } catch (err) {
      setError('Failed to load user settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveUser = async () => {
    try {
      setUser(editedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    }
  };

  const removeDevice = async (deviceId) => {
    const updatedUser = {
      ...user,
      devices: user.devices.filter(d => d.device_id !== deviceId),
    };
    setUser(updatedUser);
    setEditedUser(updatedUser);
  };

  const stats = {
    totalDevices: user?.devices?.length || 0,
    activeDevices: user?.devices?.filter(d => 
      new Date(d.last_active) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length || 0,
    accountAge: user ? Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)) : 0,
  };

  return (
    <SettingsContext.Provider
      value={{
        user,
        editedUser,
        loading,
        error,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        setEditedUser,
        saveUser,
        removeDevice,
        refreshUser: loadUser,
        stats,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
