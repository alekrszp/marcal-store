import { useState, useEffect } from 'react';
import userService from '../services/userService';

export default function useUser() {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await userService.getUser();
      setUser(data);
    } catch {
      setHasError(true);
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

  return { user, isLoading, hasError, updateAvatar, logout };
}