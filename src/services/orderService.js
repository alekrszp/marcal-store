// Service de pedidos (comprovante + histórico de compras).
//
// MODO ATUAL: USE_MOCK = true (config.js) — os pedidos são persistidos no
// AsyncStorage do dispositivo, mais recente primeiro.
//
// PARA INTEGRAR COM A API REAL:
// 1. Trocar USE_MOCK para false em src/services/config.js
// 2. Garantir que o backend implemente os endpoints comentados abaixo,
//    seguindo o modelo Order: { id, date, items, paymentMethod, total }

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';

async function getOrders() {
  if (USE_MOCK) {
    const saved = await storage.load(storage.KEYS.ORDERS);
    return saved ?? [];
  }

  // INTEGRAÇÃO: GET /api/orders
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<Order> (mais recente primeiro)
  return await httpClient.request('/api/orders');
}

async function createOrder({ items, paymentMethod, total }) {
  const order = {
    id:            Date.now().toString(),
    date:          new Date().toISOString(),
    items,
    paymentMethod,
    total,
  };

  if (USE_MOCK) {
    const orders = await getOrders();
    await storage.save(storage.KEYS.ORDERS, [order, ...orders]);
    return order;
  }

  // INTEGRAÇÃO: POST /api/orders
  // Body: { items, paymentMethod, total }
  // Resposta esperada: Order criado (com id e date gerados pelo backend)
  return await httpClient.request('/api/orders', {
    method: 'POST',
    body:   { items, paymentMethod, total },
  });
}

export default { getOrders, createOrder };
