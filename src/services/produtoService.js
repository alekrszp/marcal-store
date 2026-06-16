// Service de produtos (catálogo + CRUD da área administrativa).
//
// Integrado com o product-service via gateway-service.
// Endpoints públicos (sem JWT):
//   GET /products?targetCurrency=BRL    — lista todos os produtos em BRL
//
// Endpoints protegidos (JWT admin, rota /ws/** bloqueada pelo gateway):
//   POST   /ws/product         — cria produto
//   PUT    /ws/product/{id}    — atualiza produto
//   DELETE /ws/product/{id}    — remove produto
//
// Os campos do backend (name, imageUrl, videoUrl, description...) são
// mapeados para o modelo do app (title, image, video, descricao...) pelas
// funções _mapProduto / _toBackendProduto abaixo.
//
// IMAGEM e VÍDEO: o campo imageUrl/videoUrl deve ser uma URL pública
// (Cloudinary, Supabase Storage, etc.). O upload para o serviço de storage
// é responsabilidade do colega que integrar o backend.
//
// USE_MOCK = true  (config.js) → dados locais (AsyncStorage, src/data/produtos.js)
// USE_MOCK = false (config.js) → usa o gateway em API_URL

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { PRODUTOS, CATEGORIES, PRODUTOS_SEED_VERSION } from '../data/produtos';

// Converte o modelo do backend (product-service) para o modelo do app.
// O backend usa "name" e "price" em BRL já convertido pelo currency-service.
function _mapProduto(p) {
  return {
    id:           String(p.id),
    title:        p.name ?? p.title ?? '',
    mentor:       p.mentor ?? p.instructor ?? '',
    price:        p.price ?? 0,
    currency:     p.currency ?? 'BRL',
    tag:          p.tag ?? null,
    category:     p.category ?? p.categoria ?? '',
    image:        p.imageUrl ?? p.image ?? null,
    descricao:    p.description ?? p.descricao ?? '',
    cargaHoraria: p.workload ?? p.cargaHoraria ?? '',
    modulos:      p.modules ?? p.modulos ?? [],
    video:        p.videoUrl ?? p.video ?? null,
  };
}

function _mapProdutos(lista, category) {
  const mapped = (lista ?? []).map(_mapProduto);
  if (!category || category === 'Todos') return mapped;
  return mapped.filter(p => p.category === category);
}

// Converte o modelo do app para o formato esperado pelo backend.
function _toBackendProduto(data) {
  return {
    name:        data.title,
    instructor:  data.mentor,
    price:       data.price,
    tag:         data.tag,
    category:    data.category,
    imageUrl:    data.image,
    description: data.descricao,
    workload:    data.cargaHoraria,
    modules:     data.modulos,
    videoUrl:    data.video,
  };
}

async function loadProdutosSeeded() {
  const saved = await storage.load(storage.KEYS.PRODUTOS);
  const savedVersion = await storage.load(storage.KEYS.PRODUTOS_SEED_VERSION);

  // Se o seed em produtos.js mudou (PRODUTOS_SEED_VERSION), os produtos
  // salvos no AsyncStorage são substituídos pelo novo seed. Isso garante que
  // alterações feitas em produtos.js (durante o desenvolvimento) apareçam no
  // app mesmo após a primeira execução.
  if (saved && savedVersion === PRODUTOS_SEED_VERSION) return saved;

  await storage.save(storage.KEYS.PRODUTOS, PRODUTOS);
  await storage.save(storage.KEYS.PRODUTOS_SEED_VERSION, PRODUTOS_SEED_VERSION);
  return PRODUTOS;
}

async function getProdutos(category = null) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    if (!category || category === 'Todos') return produtos;
    return produtos.filter(p => p.category === category);
  }

  // product-service (via gateway): GET /products?targetCurrency=BRL
  // Endpoint público — sem autenticação necessária.
  // Resposta: Array<{ id, name, price, currency, ... }>
  const params = new URLSearchParams({ targetCurrency: 'BRL' });
  const produtos = await httpClient.request(`/products?${params}`, { requireAuth: false });
  return _mapProdutos(produtos, category);
}

async function getCategories() {
  if (USE_MOCK) return CATEGORIES;

  // Categorias derivadas dos produtos — o product-service não tem endpoint separado.
  const params = new URLSearchParams({ targetCurrency: 'BRL' });
  const produtos = await httpClient.request(`/products?${params}`, { requireAuth: false });
  const cats = [...new Set(produtos.map(p => p.category ?? p.categoria).filter(Boolean))];
  return cats.length ? cats : CATEGORIES;
}

async function createProduto(data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const novoProduto = { ...data, id: Date.now().toString() };
    await storage.save(storage.KEYS.PRODUTOS, [...produtos, novoProduto]);
    return novoProduto;
  }

  // product-service (via gateway): POST /ws/product — protegido por JWT (admin)
  return await httpClient.request('/ws/product', {
    method: 'POST',
    body:   _toBackendProduto(data),
  });
}

async function updateProduto(id, data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const atualizados = produtos.map(p => (p.id === id ? { ...p, ...data, id } : p));
    await storage.save(storage.KEYS.PRODUTOS, atualizados);
    return atualizados.find(p => p.id === id);
  }

  // product-service (via gateway): PUT /ws/product/{id} — protegido por JWT (admin)
  return await httpClient.request(`/ws/product/${id}`, {
    method: 'PUT',
    body:   _toBackendProduto(data),
  });
}

async function deleteProduto(id) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const restantes = produtos.filter(p => p.id !== id);
    await storage.save(storage.KEYS.PRODUTOS, restantes);
    return;
  }

  // product-service (via gateway): DELETE /ws/product/{id} — protegido por JWT (admin)
  await httpClient.request(`/ws/product/${id}`, { method: 'DELETE' });
}

export default { getProdutos, getCategories, createProduto, updateProduto, deleteProduto };
