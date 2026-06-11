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

  // Restaura a sessão ao abrir o app (se houver token salvo).
  // INTEGRAÇÃO: se o backend retornar 401 (token expirado/inválido), o httpClient
  // já limpa o storage e lança erro — aqui apenas garantimos que o estado
  // do app reflita "deslogado" nesse caso.
  async function loadUser() {
    try {
      const token = await storage.load(storage.KEYS.TOKEN);
      if (!token) return;
      const data = await userService.getUser();
      setUser(data);
    } catch (err) {
      await storage.clearAll();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, senha) {
    const data = await userService.login(email, senha);
    setUser(data);
  }

  async function register(nome, email, senha) {
    const data = await userService.register(nome, email, senha);
    setUser(data);
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
    <UserContext.Provider value={{ user, isLoading, login, register, updateAvatar, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}