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
//    { id, title, mentor, price, tag?, category, image, descricao?, cargaHoraria?, modulos?, video? }
//
// VÍDEO: "video" é o arquivo da AULA do curso (conteúdo pago). No admin,
// "video" é escolhido da galeria do dispositivo via ProdutoVideoPicker
// (URI local, ex: file://...), igual ao fluxo de "image". Em modo mock essa
// URI é salva diretamente. Produtos com "video" aparecem em "Meus Cursos"
// (MeusCursosScreen) somente para clientes que já compraram o produto (ver
// useMeusCursos.js).
//
// Especificação recomendada do arquivo de vídeo:
// - Formato: .mp4 (codec H.264) — compatível com expo-video em iOS/Android
// - Resolução: até 1080p (1920x1080)
// - Tamanho: recomendado até ~50MB por aula (arquivos maiores devem ser
//   hospedados externamente e referenciados por URL, ver abaixo)
// - Duração: sem limite técnico, mas o player não exibe transcrição/capítulos
//
// IMAGEM e VÍDEO: no admin, ambos são escolhidos da galeria do dispositivo
// (URI local, ex: file://...). Em modo mock essa URI é salva diretamente.
// Com API real, o upload deve ser feito via multipart/form-data (igual a
// userService.updateAvatar) — createProduto/updateProduto devem enviar
// "image" e "video" em requisições separadas (upload de arquivo) e usar as
// URLs retornadas pelo backend nesses campos antes de enviar o restante dos
// dados do produto. Para vídeos grandes, o backend pode optar por retornar
// uma URL de um serviço de streaming/CDN (ex: .m3u8/HLS) — o expo-video
// também suporta esse formato.

import storage from '../storage/asyncStorageHelper';
import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { PRODUTOS, CATEGORIES, PRODUTOS_SEED_VERSION } from '../data/produtos';

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
