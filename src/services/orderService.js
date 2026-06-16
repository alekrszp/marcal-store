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

// Normaliza o modelo do order-service para o formato usado pelo app.
function _mapOrder(o) {
  return {
    id:            String(o.id ?? o.orderId ?? Date.now()),
    date:          o.date ?? o.createdAt ?? new Date().toISOString(),
    items:         o.items ?? o.products ?? [],
    paymentMethod: o.paymentMethod ?? o.payment ?? '',
    total:         o.total ?? o.totalAmount ?? 0,
    currency:      o.currency ?? 'BRL',
  };
}

async function getOrders() {
  if (USE_MOCK) {
    const saved = await storage.load(storage.KEYS.ORDERS);
    return saved ?? [];
  }

  // order-service (via gateway): GET /ws/orders/BRL — protegido por JWT
  // Retorna pedidos do usuário autenticado com valores em BRL
  const orders = await httpClient.request('/ws/orders/BRL');
  return (orders ?? []).map(_mapOrder);
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

  // order-service (via gateway): POST /ws/orders — protegido por JWT
  const created = await httpClient.request('/ws/orders', {
    method: 'POST',
    body:   { items, paymentMethod, total },
  });
  return _mapOrder(created ?? order);
}

export default { getOrders, createOrder };
