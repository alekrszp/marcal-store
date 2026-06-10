import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';
import storage from '../storage/asyncStorageHelper';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await storage.load(storage.KEYS.TOKEN);
      if (!token) return;
      const data = await userService.getUser();
      setUser(data);
    } catch (err) {
      await storage.clearAll();
    } finally {
      setIsLoading(false);
    }
  }

  async function updateAvatar(uri) {
    await userService.updateAvatar(uri);
    setUser(prev => ({ ...prev, avatar: uri }));
  }

  async function logout() {
    await userService.logout();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, isLoading, updateAvatar, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}