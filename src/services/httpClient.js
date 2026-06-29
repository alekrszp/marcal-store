// Cliente HTTP centralizado para integração com a API real.
// Usado pelos services (userService, produtoService, etc.) quando USE_MOCK = false.
//
// Centraliza:
// - Montagem da URL (API_URL + endpoint)
// - Header de autenticação (Authorization: Bearer <token>)
// - Parse de JSON e de erros vindos do backend
// - Tratamento de sessão expirada (401)
//
// INTEGRAÇÃO COM BACKEND:
// O backend deve responder erros no formato { message: string } para que
// a mensagem apareça corretamente nas telas (ex: errors.geral no Login/Cadastro).
// Caso o backend use outro formato (ex: { error: string } ou { errors: [...] }),
// ajustar a função `extractErrorMessage` abaixo.

import storage from '../storage/asyncStorageHelper';
import { API_URL } from './config';

function extractErrorMessage(body, fallback, status) {
  if (!body) return fallback;
  if (body.message) return body.message;
  if (body.status === 503 || body.error === 'Service Unavailable') {
    return 'Serviço temporariamente indisponível. Aguarde alguns segundos e tente novamente.';
  }
  if (body.error === 'Internal Server Error' || status === 500) {
    return 'Erro no servidor. Se você ficou muito tempo logado, saia e entre novamente.';
  }
  if (body.error) return body.error;
  return fallback;
}

async function request(endpoint, { method = 'GET', body, requireAuth = true, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };

  if (requireAuth) {
    const token = await storage.load(storage.KEYS.TOKEN);
    if (!token) throw new Error('Usuário não autenticado');
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Erro de rede (sem internet, API fora do ar, etc.)
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet.');
  }

  // Sessão expirada ou token inválido.
  // INTEGRAÇÃO: quando o backend estiver no ar, considerar implementar refresh token
  // aqui antes de derrubar a sessão (POST /api/auth/refresh com refreshToken salvo).
  if (response.status === 401) {
    await storage.clearAll();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let errorBody = null;

    if (contentType.includes('application/json')) {
      errorBody = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      errorBody = text ? { message: text } : null;
    }

    throw new Error(extractErrorMessage(errorBody, `Erro ${response.status}`, response.status));
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return null;
  return await response.json();
}

async function upload(endpoint, formData, { requireAuth = true } = {}) {
  const finalHeaders = {};

  if (requireAuth) {
    const token = await storage.load(storage.KEYS.TOKEN);
    if (!token) throw new Error('Usuário não autenticado');
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: finalHeaders,
      body: formData,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet.');
  }

  if (response.status === 401) {
    await storage.clearAll();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let errorBody = null;

    if (contentType.includes('application/json')) {
      errorBody = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      errorBody = text ? { message: text } : null;
    }

    throw new Error(extractErrorMessage(errorBody, `Erro ${response.status}`, response.status));
  }

  return await response.json();
}

export default { request, upload };
