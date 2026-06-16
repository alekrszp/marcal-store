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

// Extrai campos básicos do payload JWT sem biblioteca externa.
function _decodeUserFromToken(token, fallbackEmail) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id:    payload.sub ?? payload.id ?? null,
      nome:  payload.name ?? payload.nome ?? fallbackEmail,
      email: payload.email ?? fallbackEmail,
      role:  payload.role ?? payload.roles?.[0] ?? 'cliente',
    };
  } catch {
    return { id: null, nome: fallbackEmail, email: fallbackEmail, role: 'cliente' };
  }
}

async function getUser() {
  if (USE_MOCK) {
    const savedUser   = await storage.load(storage.KEYS.USER);
    const savedAvatar = await storage.load(storage.KEYS.AVATAR);
    const user        = savedUser ?? MOCK_USER;
    const role        = isAdminEmail(user.email) ? 'admin' : 'cliente';
    return { ...user, avatar: savedAvatar ?? user.avatar, role };
  }

  // O auth-service não expõe /me. Os dados do usuário são salvos localmente
  // no momento do login/cadastro e restaurados do storage.
  const savedUser   = await storage.load(storage.KEYS.USER);
  const savedAvatar = await storage.load(storage.KEYS.AVATAR);
  if (!savedUser) throw new Error('Sessão não encontrada. Faça login novamente.');
  return { ...savedUser, avatar: savedAvatar ?? savedUser.avatar };
}

async function updateAvatar(uri) {
  // Avatar salvo localmente (o auth-service não expõe endpoint de avatar).
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

  // auth-service: POST /auth/signin
  // Body: { email, password }
  // Resposta: { token } — dados do usuário vêm no payload do JWT ou são montados aqui
  const data = await httpClient.request('/auth/signin', {
    method:      'POST',
    body:        { email, password: senha },
    requireAuth: false,
  });

  const token = data.token ?? data.accessToken ?? data;
  await storage.save(storage.KEYS.TOKEN, token);

  // Monta objeto de usuário a partir do que o backend retornar.
  // Se o backend retornar { token, user } usamos data.user; senão decodificamos o JWT.
  const user = data.user ?? _decodeUserFromToken(token, email);
  const role = isAdminEmail(email) ? 'admin' : (user.role ?? 'cliente');
  const finalUser = { ...user, email, role };
  await storage.save(storage.KEYS.USER, finalUser);
  return finalUser;
}

async function register(nome, email, senha) {
  if (USE_MOCK) {
    const role = isAdminEmail(email) ? 'admin' : 'cliente';
    const user = { id: '1', nome, email, avatar: null, role };
    await storage.save(storage.KEYS.USER,  user);
    await storage.save(storage.KEYS.TOKEN, 'mock-token-123');
    return user;
  }

  // auth-service: POST /auth/signup
  // Body: { name, email, password }
  // Resposta: { token } ou { token, user }
  const data = await httpClient.request('/auth/signup', {
    method:      'POST',
    body:        { name: nome, email, password: senha },
    requireAuth: false,
  });

  const token = data.token ?? data.accessToken ?? data;
  await storage.save(storage.KEYS.TOKEN, token);

  const user = data.user ?? _decodeUserFromToken(token, email);
  const role = isAdminEmail(email) ? 'admin' : (user.role ?? 'cliente');
  const finalUser = { ...user, nome: user.name ?? user.nome ?? nome, email, role };
  await storage.save(storage.KEYS.USER, finalUser);
  return finalUser;
}

async function requestPasswordReset(email) {
  if (USE_MOCK) {
    // Em mock, apenas simula sucesso (nenhum e-mail é enviado de fato)
    return { success: true };
  }

  // O auth-service não implementa recuperação de senha; retorna sucesso simulado.
  return { success: true };
}

async function logout() {
  // INTEGRAÇÃO: opcionalmente, chamar POST /api/auth/logout antes de limpar o
  // storage local, para que o backend invalide o refreshToken salvo.
  // Ex: if (!USE_MOCK) await httpClient.request('/api/auth/logout', { method: 'POST' });
  await storage.clearAll();
}

export default { getUser, updateAvatar, login, register, requestPasswordReset, logout };
