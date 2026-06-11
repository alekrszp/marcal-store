// Service do carrinho de compras.
//
// MODO ATUAL: USE_MOCK = true (config.js) — o carrinho é persistido no
// AsyncStorage do dispositivo (por usuário/dispositivo, sem backend).
//
// PARA INTEGRAR COM A API REAL:
// 1. Trocar USE_MOCK para false em src/services/config.js
// 2. Garantir que o backend implemente os endpoints comentados abaixo,
//    seguindo o modelo CartItem: { id, title, mentor, price, image, quantity }

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';

async function getCart() {
  if (USE_MOCK) {
    const saved = await storage.load(storage.KEYS.CART);
    return saved ?? [];
  }

  // INTEGRAÇÃO: GET /api/cart
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<CartItem>
  return await httpClient.request('/api/cart');
}

async function saveCart(items) {
  if (USE_MOCK) {
    await storage.save(storage.KEYS.CART, items);
    return;
  }

  // INTEGRAÇÃO: PUT /api/cart
  // Body: Array<CartItem>
  await httpClient.request('/api/cart', {
    method: 'PUT',
    body:   items,
  });
}

export default { getCart, saveCart };
