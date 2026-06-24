// Service de produtos (catálogo + CRUD da área administrativa).
//
// Integrado com o product-service via gateway-service.
// Endpoints públicos (sem JWT):
//   GET /products?targetCurrency=BRL&page=0&size=100
//
// Endpoints protegidos (JWT admin, rota /ws/** bloqueada pelo gateway):
//   POST   /ws/products         — cria produto
//   PUT    /ws/products/{id}    — atualiza produto
//   DELETE /ws/products/{id}    — remove produto
//
// USE_MOCK = true  (config.js) → dados locais (AsyncStorage, src/data/produtos.js)
// USE_MOCK = false (config.js) → usa o gateway em API_URL

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { PRODUTOS, CATEGORIES, PRODUTOS_SEED_VERSION } from '../data/produtos';
import {
  unwrapPage,
  parseWorkload,
  parseModulesCount,
  formatWorkload,
} from './apiHelpers';

const PAGE_SIZE = 100;

function _mapProduto(p) {
  const price = p.convertedPrice ?? p.price ?? 0;
  const currency = p.requestedCurrency ?? p.currency ?? 'BRL';
  const modulesCount = typeof p.modules === 'number'
    ? p.modules
    : (Array.isArray(p.modulos) ? p.modulos.length : 0);

  return {
    id:           String(p.id),
    title:        p.name ?? p.title ?? '',
    mentor:       p.instructor ?? p.mentor ?? '',
    price,
    currency,
    tag:          p.tag ?? null,
    category:     p.category ?? p.categoria ?? 'Curso',
    image:        p.imageUrl ?? p.image ?? null,
    descricao:    p.description ?? p.descricao ?? '',
    cargaHoraria: formatWorkload(p.workload ?? p.cargaHoraria),
    modulos:      Array.isArray(p.modulos)
      ? p.modulos
      : (modulesCount > 0 ? Array.from({ length: modulesCount }, (_, i) => `Módulo ${i + 1}`) : []),
    video:        p.videoUrl ?? p.video ?? null,
  };
}

function _mapProdutos(lista, category) {
  const mapped = (lista ?? []).map(_mapProduto);
  if (!category || category === 'Todos') return mapped;
  return mapped.filter(p => p.category === category);
}

function _toBackendProduto(data) {
  return {
    name:        data.title,
    instructor:  data.mentor,
    price:       data.price,
    currency:    'BRL',
    imageUrl:    typeof data.image === 'string' ? data.image : '',
    videoUrl:    typeof data.video === 'string' ? data.video : '',
    description: data.descricao ?? '',
    workload:    parseWorkload(data.cargaHoraria),
    modules:     parseModulesCount(data.modulos),
  };
}

async function _fetchAllProducts() {
  const params = new URLSearchParams({
    targetCurrency: 'BRL',
    page:           '0',
    size:           String(PAGE_SIZE),
  });
  const response = await httpClient.request(`/products?${params}`, { requireAuth: false });
  return unwrapPage(response);
}

async function loadProdutosSeeded() {
  const saved = await storage.load(storage.KEYS.PRODUTOS);
  const savedVersion = await storage.load(storage.KEYS.PRODUTOS_SEED_VERSION);

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

  const produtos = await _fetchAllProducts();
  return _mapProdutos(produtos, category);
}

async function getCategories() {
  if (USE_MOCK) return CATEGORIES;

  const produtos = await _fetchAllProducts();
  const cats = [...new Set(produtos.map(p => p.category ?? p.categoria).filter(Boolean))];
  return cats.length ? ['Todos', ...cats] : CATEGORIES;
}

async function createProduto(data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const novoProduto = { ...data, id: Date.now().toString() };
    await storage.save(storage.KEYS.PRODUTOS, [...produtos, novoProduto]);
    return novoProduto;
  }

  const created = await httpClient.request('/ws/products', {
    method: 'POST',
    body:   _toBackendProduto(data),
  });
  return _mapProduto({ ...created, category: data.category });
}

async function updateProduto(id, data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const atualizados = produtos.map(p => (p.id === id ? { ...p, ...data, id } : p));
    await storage.save(storage.KEYS.PRODUTOS, atualizados);
    return atualizados.find(p => p.id === id);
  }

  const updated = await httpClient.request(`/ws/products/${id}`, {
    method: 'PUT',
    body:   _toBackendProduto(data),
  });
  return _mapProduto({ ...updated, category: data.category });
}

async function deleteProduto(id) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const restantes = produtos.filter(p => p.id !== id);
    await storage.save(storage.KEYS.PRODUTOS, restantes);
    return;
  }

  await httpClient.request(`/ws/products/${id}`, { method: 'DELETE' });
}

export default { getProdutos, getCategories, createProduto, updateProduto, deleteProduto };
