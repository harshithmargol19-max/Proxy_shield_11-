import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { AccountStatus } from '../types/settings';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const auth = useAuth();
  const authUser = auth?.user;
  const getIdToken = auth?.getIdToken;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const loadUser = useCallback(async () => {
    // Wait for auth to be ready
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    // Create fallback user from Firebase auth
    const fallbackUser = {
      firebase_uid: authUser.uid,
      real_email: authUser.email || null,
      display_name: authUser.displayName || null,
      photo_url: authUser.photoURL || null,
      is_anonymous: authUser.isAnonymous || false,
      devices: [],
      created_at: new Date().toISOString(),
      status: 'active',
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get ID token
      let idToken = null;
      if (getIdToken) {
        try {
          idToken = await getIdToken();
        } catch (tokenErr) {
          console.warn('Could not get ID token:', tokenErr.message);
        }
      }
      
      if (!idToken) {
        // Use Firebase auth user data as fallback
        setUser(fallbackUser);
        setEditedUser(fallbackUser);
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = response.data?.data || response.data;
      setUser(data);
      setEditedUser(data);
    } catch (err) {
      console.warn('Using fallback user data:', err.message);
      // Use auth user data as fallback on any error
      setUser(fallbackUser);
      setEditedUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, [authUser, getIdToken]);

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
