export function formatCurrency(value) {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(safe);
}

export function formatDate(isoString) {
  return new Intl.DateTimeFormat('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}