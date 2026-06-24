// Service de pedidos (comprovante + histórico de compras).
//
// Integrado com o order-service via gateway-service.
// Endpoints protegidos (JWT, rota /ws/** bloqueada pelo gateway):
//   GET  /ws/orders?targetCurrency=BRL  — lista pedidos do usuário autenticado
//   POST /ws/orders                     — cria novo pedido
//
// USE_MOCK = true  (config.js) → persiste pedidos no AsyncStorage local
// USE_MOCK = false (config.js) → usa o gateway em API_URL

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { unwrapPage } from './apiHelpers';

const PAGE_SIZE = 100;

function _mapOrderItem(item) {
  const productId = String(item.productId ?? item.id ?? '');
  const price = item.convertedPriceAtPruchase
    ?? item.convertedPrice
    ?? item.priceAtPurchase
    ?? item.price
    ?? 0;

  return {
    id:       productId,
    productId,
    title:    item.title
      ?? item.product?.name
      ?? item.product?.description
      ?? `Produto #${productId}`,
    price,
    quantity: item.quantity ?? 1,
    image:    item.image ?? item.product?.imageURL ?? item.product?.imageUrl ?? null,
  };
}

function _mapOrder(o, paymentMethodFallback = '') {
  const items = (o.items ?? o.products ?? []).map(_mapOrderItem);
  return {
    id:            String(o.id ?? o.orderId ?? Date.now()),
    date:          o.orderDate ?? o.date ?? o.createdAt ?? new Date().toISOString(),
    items,
    paymentMethod: o.paymentMethod ?? o.payment ?? paymentMethodFallback,
    total:         o.totalConvertedPrice ?? o.totalPrice ?? o.total ?? o.totalAmount ?? 0,
    currency:      o.currency ?? 'BRL',
  };
}

async function getOrders() {
  if (USE_MOCK) {
    const saved = await storage.load(storage.KEYS.ORDERS);
    return saved ?? [];
  }

  const params = new URLSearchParams({
    targetCurrency: 'BRL',
    page:           '0',
    size:           String(PAGE_SIZE),
  });
  const response = await httpClient.request(`/ws/orders?${params}`);
  const orders = unwrapPage(response).map(o => _mapOrder(o));

  try {
    const catalogParams = new URLSearchParams({
      targetCurrency: 'BRL',
      page:           '0',
      size:           String(PAGE_SIZE),
    });
    const catalog = unwrapPage(
      await httpClient.request(`/products?${catalogParams}`, { requireAuth: false })
    );
    const productMap = new Map(catalog.map(p => [String(p.id), p]));

    return orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const product = productMap.get(item.productId);
        if (!product) return item;
        return {
          ...item,
          title: product.name ?? item.title,
          image: product.imageUrl ?? item.image,
        };
      }),
    }));
  } catch {
    return orders;
  }
}

async function createOrder({ items, paymentMethod, total }) {
  const localOrder = {
    id:            Date.now().toString(),
    date:          new Date().toISOString(),
    items,
    paymentMethod,
    total,
  };

  if (USE_MOCK) {
    const orders = await getOrders();
    await storage.save(storage.KEYS.ORDERS, [localOrder, ...orders]);
    return localOrder;
  }

  const backendItems = items.map(item => ({
    productId: Number(item.id),
    quantity:  item.quantity ?? 1,
  }));

  const created = await httpClient.request('/ws/orders', {
    method: 'POST',
    body:   { items: backendItems },
  });

  const order = _mapOrder(created, paymentMethod);

  // Enriquece itens com dados do carrinho (títulos/preços) para exibição no comprovante
  order.items = items.map(cartItem => ({
    id:       String(cartItem.id),
    title:    cartItem.title,
    price:    cartItem.price,
    quantity: cartItem.quantity ?? 1,
    image:    cartItem.image ?? null,
  }));
  order.paymentMethod = paymentMethod;
  order.total = total ?? order.total;

  return order;
}

export default { getOrders, createOrder };
