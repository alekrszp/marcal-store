import storage from '../storage/asyncStorageHelper';
import { USE_MOCK, API_URL } from './config';
import { COURSES, CATEGORIES } from '../data/courses';

async function getCourses(category = null) {
  if (USE_MOCK) {
    if (!category || category === 'Todos') return COURSES;
    return COURSES.filter(c => c.category === category);
  }

  // INTEGRAÇÃO: GET /api/courses?category=<category>
  // Header: Authorization: Bearer <token>
  // Resposta: Array<{ id, title, mentor, price, tag?, category, image }>
  const token    = await storage.load(storage.KEYS.TOKEN);
  const query    = category && category !== 'Todos' ? `?category=${category}` : '';
  const response = await fetch(`${API_URL}/api/courses${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}

async function getCategories() {
  if (USE_MOCK) return CATEGORIES;

  // INTEGRAÇÃO: GET /api/categories
  // Header: Authorization: Bearer <token>
  // Resposta: Array<string>
  const token    = await storage.load(storage.KEYS.TOKEN);
  const response = await fetch(`${API_URL}/api/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}

export default { getCourses, getCategories };