import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { COURSES, CATEGORIES } from '../data/courses';

async function getCourses(category = null) {
  if (USE_MOCK) {
    if (!category || category === 'Todos') return COURSES;
    return COURSES.filter(c => c.category === category);
  }

  // INTEGRAÇÃO: GET /api/courses?category=<category>
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<{ id, title, mentor, price, tag?, category, image, descricao?, cargaHoraria?, modulos? }>
  const query = category && category !== 'Todos' ? `?category=${category}` : '';
  return await httpClient.request(`/api/courses${query}`);
}

async function getCategories() {
  if (USE_MOCK) return CATEGORIES;

  // INTEGRAÇÃO: GET /api/categories
  // Header: Authorization: Bearer <token> (adicionado automaticamente pelo httpClient)
  // Resposta esperada: Array<string>
  return await httpClient.request('/api/categories');
}

export default { getCourses, getCategories };