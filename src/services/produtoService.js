// Service de produtos (catálogo + CRUD da área administrativa).
//
// MODO ATUAL: USE_MOCK = true (config.js) — os produtos são persistidos no
// AsyncStorage do dispositivo, "semeados" a partir de src/data/produtos.js
// na primeira execução. O CRUD do admin (criar/editar/excluir) altera essa
// lista local, e o catálogo do cliente reflete essas alterações.
//
// PARA INTEGRAR COM A API REAL:
// 1. Trocar USE_MOCK para false em src/services/config.js
// 2. Garantir que o backend implemente os endpoints comentados abaixo,
//    todos seguindo o modelo Produto:
//    { id, title, mentor, price, tag?, category, image, descricao?, cargaHoraria?, modulos? }
//
// IMAGEM: no admin, "image" é escolhida da galeria do dispositivo (URI local,
// ex: file://...). Em modo mock essa URI é salva diretamente. Com API real,
// o upload deve ser feito via multipart/form-data (igual a
// userService.updateAvatar) — createProduto/updateProduto devem enviar a
// imagem em uma requisição separada e usar a URL retornada pelo backend
// no campo "image".

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { PRODUTOS, CATEGORIES } from '../data/produtos';

async function loadProdutosSeeded() {
  const saved = await storage.load(storage.KEYS.PRODUTOS);
  if (saved) return saved;

  await storage.save(storage.KEYS.PRODUTOS, PRODUTOS);
  return PRODUTOS;
}

async function getProdutos(category = null) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    if (!category || category === 'Todos') return produtos;
    return produtos.filter(p => p.category === category);
  }

  // INTEGRAÇÃO: GET /api/produtos?category=<category>
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<Produto>
  const query = category && category !== 'Todos' ? `?category=${category}` : '';
  return await httpClient.request(`/api/produtos${query}`);
}

async function getCategories() {
  if (USE_MOCK) return CATEGORIES;

  // INTEGRAÇÃO: GET /api/categories
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<string>
  return await httpClient.request('/api/categories');
}

async function createProduto(data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const novoProduto = { ...data, id: Date.now().toString() };
    await storage.save(storage.KEYS.PRODUTOS, [...produtos, novoProduto]);
    return novoProduto;
  }

  // INTEGRAÇÃO: POST /api/produtos
  // Body: Produto (sem id, gerado pelo backend)
  // Resposta esperada: Produto criado (com id)
  return await httpClient.request('/api/produtos', {
    method: 'POST',
    body:   data,
  });
}

async function updateProduto(id, data) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const atualizados = produtos.map(p => (p.id === id ? { ...p, ...data, id } : p));
    await storage.save(storage.KEYS.PRODUTOS, atualizados);
    return atualizados.find(p => p.id === id);
  }

  // INTEGRAÇÃO: PUT /api/produtos/:id
  // Body: Produto atualizado
  // Resposta esperada: Produto atualizado
  return await httpClient.request(`/api/produtos/${id}`, {
    method: 'PUT',
    body:   data,
  });
}

async function deleteProduto(id) {
  if (USE_MOCK) {
    const produtos = await loadProdutosSeeded();
    const restantes = produtos.filter(p => p.id !== id);
    await storage.save(storage.KEYS.PRODUTOS, restantes);
    return;
  }

  // INTEGRAÇÃO: DELETE /api/produtos/:id
  // Resposta esperada: 204 No Content
  await httpClient.request(`/api/produtos/${id}`, { method: 'DELETE' });
}

export default { getProdutos, getCategories, createProduto, updateProduto, deleteProduto };
