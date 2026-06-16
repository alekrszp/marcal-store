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
