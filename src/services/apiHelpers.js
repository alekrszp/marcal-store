// Utilitários compartilhados para integração com microservices (Spring Page, etc.)

export function unwrapPage(response) {
  if (Array.isArray(response)) return response;
  if (response?.content) return response.content;
  return response ?? [];
}

export function parsePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const raw = String(value ?? '').trim();
  if (!raw) return 0;

  const normalized = raw.includes(',')
    ? raw.replace(/\./g, '').replace(',', '.')
    : raw;

  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}

export function parseWorkload(value) {
  if (typeof value === 'number' && value > 0) return value;
  if (!value) return 1;
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function parseModulesCount(value) {
  if (typeof value === 'number' && value >= 0) return value;
  if (Array.isArray(value)) return value.length;
  return 0;
}

export function formatWorkload(workload) {
  if (typeof workload === 'string' && workload.trim()) return workload;
  if (typeof workload === 'number') return `${workload}h`;
  return '';
}

export function userTypeToRole(type) {
  if (type === 0 || type === 'Admin') return 'admin';
  return 'cliente';
}
