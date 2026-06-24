// Service de autenticação e dados do usuário.
//
// Integrado com o auth-service via gateway-service (Spring Cloud Gateway).
// Endpoints:
//   POST /auth/signup — cadastro   → body: { name, email, password }
//   POST /auth/signin — login      → body: { email, password }
//
// O auth-service não expõe GET /me nem endpoint de avatar.
// Os dados do usuário são extraídos do payload JWT e persistidos localmente.
//
// USE_MOCK = true  (config.js) → funciona sem backend (AsyncStorage local)
// USE_MOCK = false (config.js) → usa o gateway em API_URL

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { MOCK_USER } from '../data/user';
import { isAdminEmail } from '../data/admin';
import { userTypeToRole } from './apiHelpers';

function _decodeUserFromToken(token, fallbackEmail) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id:    String(payload.id ?? payload.sub ?? ''),
      nome:  payload.name ?? payload.nome ?? fallbackEmail,
      email: payload.email ?? fallbackEmail,
      role:  userTypeToRole(payload.type ?? payload.role),
    };
  } catch {
    return { id: null, nome: fallbackEmail, email: fallbackEmail, role: 'cliente' };
  }
}

function _mapBackendUser(user, email) {
  return {
    id:    String(user.id ?? ''),
    nome:  user.name ?? user.nome ?? email,
    email: user.email ?? email,
    role:  userTypeToRole(user.type),
  };
}

async function getUser() {
  if (USE_MOCK) {
    const savedUser   = await storage.load(storage.KEYS.USER);
    const savedAvatar = await storage.load(storage.KEYS.AVATAR);
    const user        = savedUser ?? MOCK_USER;
    const role        = isAdminEmail(user.email) ? 'admin' : 'cliente';
    return { ...user, avatar: savedAvatar ?? user.avatar, role };
  }

  const savedUser   = await storage.load(storage.KEYS.USER);
  const savedAvatar = await storage.load(storage.KEYS.AVATAR);
  if (!savedUser) throw new Error('Sessão não encontrada. Faça login novamente.');
  return { ...savedUser, avatar: savedAvatar ?? savedUser.avatar };
}

async function updateAvatar(uri) {
  await storage.save(storage.KEYS.AVATAR, uri);
}

async function login(email, senha) {
  if (USE_MOCK) {
    const role = isAdminEmail(email) ? 'admin' : 'cliente';
    const user = { ...MOCK_USER, email, role };
    await storage.save(storage.KEYS.USER,  user);
    await storage.save(storage.KEYS.TOKEN, 'mock-token-123');
    return user;
  }

  const data = await httpClient.request('/auth/signin', {
    method:      'POST',
    body:        { email, password: senha },
    requireAuth: false,
  });

  const token = data.token;
  if (!token) throw new Error('Token não recebido do servidor');

  await storage.save(storage.KEYS.TOKEN, token);

  const user = data.user
    ? _mapBackendUser(data.user, email)
    : _decodeUserFromToken(token, email);

  await storage.save(storage.KEYS.USER, user);
  return user;
}

async function register(nome, email, senha) {
  if (USE_MOCK) {
    const role = isAdminEmail(email) ? 'admin' : 'cliente';
    const user = { id: '1', nome, email, avatar: null, role };
    await storage.save(storage.KEYS.USER,  user);
    await storage.save(storage.KEYS.TOKEN, 'mock-token-123');
    return user;
  }

  // signup retorna apenas UserEntity (sem token) — faz signin em seguida
  await httpClient.request('/auth/signup', {
    method:      'POST',
    body:        { name: nome, email, password: senha },
    requireAuth: false,
  });

  return await login(email, senha);
}

async function requestPasswordReset(email) {
  if (USE_MOCK) return { success: true };
  return { success: true };
}

async function logout() {
  await storage.clearAll();
}

export default { getUser, updateAvatar, login, register, requestPasswordReset, logout };
