// Service do carrinho de compras.
//
// O backend não possui microservice de carrinho — o carrinho permanece
// persistido localmente no AsyncStorage (por usuário/dispositivo), mesmo
// com USE_MOCK = false. Apenas pedidos e catálogo usam a API.

import storage from '../storage/asyncStorageHelper';

async function getCart() {
  const saved = await storage.load(storage.KEYS.CART);
  return saved ?? [];
}

async function saveCart(items) {
  await storage.save(storage.KEYS.CART, items);
}

export default { getCart, saveCart };
