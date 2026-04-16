import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

// Storage helper — works on both web and mobile
const storage = {
  get: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    const A = (await import('@react-native-async-storage/async-storage')).default;
    return A.getItem(key);
  },
  set: async (key: string, value: string) => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    const A = (await import('@react-native-async-storage/async-storage')).default;
    await A.setItem(key, value);
  },
  remove: async (key: string) => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    const A = (await import('@react-native-async-storage/async-storage')).default;
    await A.removeItem(key);
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on app start
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await storage.get('user_token');
        const savedUser = await storage.get('user_profile');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch { }
      finally { setIsLoading(false); }
    };
    loadSession();
  }, []);

  const login = async (newToken: string, newUser: UserProfile) => {
    await storage.set('user_token', newToken);
    await storage.set('user_profile', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await storage.remove('user_token');
    await storage.remove('user_profile');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);