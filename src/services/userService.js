import storage from '../storage/asyncStorageHelper';
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
  // Resposta: { id, nome, email, avatar? }
  const token    = await storage.load(storage.KEYS.TOKEN);
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await response.json();
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
  const token    = await storage.load(storage.KEYS.TOKEN);
  const formData = new FormData();
  formData.append('avatar', { uri, type: 'image/jpeg', name: 'avatar.jpg' });
  await fetch(`${API_URL}/api/auth/me/avatar`, {
    method:  'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body:    formData,
  });
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
  // Resposta: { token, user: { id, nome, email, avatar? } }
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  await storage.save(storage.KEYS.TOKEN, data.token);
  await storage.save(storage.KEYS.USER,  data.user);
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
  // Resposta: { token, user: { id, nome, email } }
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ nome, email, senha }),
  });
  const data = await response.json();
  await storage.save(storage.KEYS.TOKEN, data.token);
  await storage.save(storage.KEYS.USER,  data.user);
  return data.user;
}

async function logout() {
  await storage.clearAll();
}

export default { getUser, updateAvatar, login, register, logout };