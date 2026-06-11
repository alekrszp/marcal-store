// Service de autenticação e dados do usuário.
//
// MODO ATUAL: USE_MOCK = true (config.js) — tudo funciona localmente,
// sem backend, usando AsyncStorage para simular sessão e persistência.
//
// PARA INTEGRAR COM A API REAL:
// 1. Trocar USE_MOCK para false em src/services/config.js
// 2. Ajustar API_URL para o endereço do backend
// 3. Garantir que o backend implemente os endpoints comentados abaixo
//
// SEGURANÇA:
// - Toda comunicação deve ocorrer via HTTPS (API_URL com https://)
// - Senhas nunca são armazenadas localmente, apenas enviadas no login/cadastro
// - O token retornado pelo backend é salvo via storage (ver storage/asyncStorageHelper.js
//   para nota sobre armazenamento seguro de token em produção)

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK, API_URL } from './config';
import { MOCK_USER } from '../data/user';

async function getUser() {
  if (USE_MOCK) {
    const savedUser   = await storage.load(storage.KEYS.USER);
    const savedAvatar = await storage.load(storage.KEYS.AVATAR);
    const user        = savedUser ?? MOCK_USER;
    return { ...user, avatar: savedAvatar ?? user.avatar };
  }

  // INTEGRAÇÃO: GET /api/auth/me — Header: Authorization: Bearer <token>
  // Resposta esperada: { id, nome, email, avatar?, role? }
  // "role" pode ser usado futuramente para liberar a área administrativa (admin/cliente)
  const user = await httpClient.request('/api/auth/me');
  await storage.save(storage.KEYS.USER, user);
  return user;
}

async function updateAvatar(uri) {
  if (USE_MOCK) {
    await storage.save(storage.KEYS.AVATAR, uri);
    return;
  }

  // INTEGRAÇÃO: PATCH /api/auth/me/avatar
  // Body: FormData com campo "avatar" (multipart/form-data)
  // Header: Authorization: Bearer <token>
  // Obs: não usa httpClient pois o Content-Type precisa ser multipart, não JSON
  const token = await storage.load(storage.KEYS.TOKEN);
  if (!token) throw new Error('Usuário não autenticado');

  const formData = new FormData();
  formData.append('avatar', { uri, type: 'image/jpeg', name: 'avatar.jpg' });

  let response;
  try {
    response = await fetch(`${API_URL}/api/auth/me/avatar`, {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    });
  } catch (err) {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet.');
  }

  if (!response.ok) throw new Error(`Erro ${response.status} ao atualizar foto de perfil`);
}

async function login(email, senha) {
  if (USE_MOCK) {
    const user = { ...MOCK_USER, email };
    await storage.save(storage.KEYS.USER,  user);
    await storage.save(storage.KEYS.TOKEN, 'mock-token-123');
    return user;
  }

  // INTEGRAÇÃO: POST /api/auth/login
  // Body: { email, senha }
  // Resposta esperada: { token, refreshToken?, user: { id, nome, email, avatar?, role? } }
  // Erros esperados: 401 com { message: 'E-mail ou senha incorretos' }
  const data = await httpClient.request('/api/auth/login', {
    method:      'POST',
    body:        { email, senha },
    requireAuth: false,
  });

  await storage.save(storage.KEYS.TOKEN, data.token);
  await storage.save(storage.KEYS.USER,  data.user);
  // INTEGRAÇÃO: se o backend retornar refreshToken, salvar também:
  // if (data.refreshToken) await storage.save(storage.KEYS.REFRESH_TOKEN, data.refreshToken);
  return data.user;
}

async function register(nome, email, senha) {
  if (USE_MOCK) {
    const user = { id: '1', nome, email, avatar: null };
    await storage.save(storage.KEYS.USER,  user);
    await storage.save(storage.KEYS.TOKEN, 'mock-token-123');
    return user;
  }

  // INTEGRAÇÃO: POST /api/auth/register
  // Body: { nome, email, senha }
  // Resposta esperada: { token, user: { id, nome, email, role? } }
  // Erros esperados: 409 com { message: 'E-mail já cadastrado' }
  const data = await httpClient.request('/api/auth/register', {
    method:      'POST',
    body:        { nome, email, senha },
    requireAuth: false,
  });

  await storage.save(storage.KEYS.TOKEN, data.token);
  await storage.save(storage.KEYS.USER,  data.user);
  return data.user;
}

async function requestPasswordReset(email) {
  if (USE_MOCK) {
    // Em mock, apenas simula sucesso (nenhum e-mail é enviado de fato)
    return { success: true };
  }

  // INTEGRAÇÃO: POST /api/auth/forgot-password
  // Body: { email }
  // Resposta esperada: { success: true } — backend envia e-mail com link/código de redefinição
  return await httpClient.request('/api/auth/forgot-password', {
    method:      'POST',
    body:        { email },
    requireAuth: false,
  });
}

async function logout() {
  await storage.clearAll();
}

export default { getUser, updateAvatar, login, register, requestPasswordReset, logout };
