// INTEGRAÇÃO: substituir este arquivo por chamadas reais à API
// Endpoint esperado: GET /api/courses → Array<Course>
// Endpoint esperado: GET /api/categories → Array<string>
// Modelo Course: { id, title, mentor, price, tag?, category, image }

export const CATEGORIES = ['Todos', 'Mentoria', 'Negócios', 'Mindset', 'Vendas', 'Liderança'];

export const COURSES = [
  { id: '1', title: 'Mente Milionária',  mentor: 'Pablo Marçal', price: '997', tag: 'TOP',  category: 'Mentoria',  image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80' },
  { id: '2', title: 'Gestão de Elite',   mentor: 'Alessandro',   price: '697',               category: 'Negócios',  image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
  { id: '3', title: 'Vendas na Prática', mentor: 'Felipe',       price: '597', tag: 'NOVO', category: 'Vendas',    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' },
  { id: '4', title: 'Liderança Total',   mentor: 'Pedro',        price: '797',               category: 'Liderança', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80' },
  { id: '5', title: 'Mindset Vencedor',  mentor: 'Pablo Marçal', price: '497', tag: 'TOP',  category: 'Mindset',   image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
  { id: '6', title: 'Finanças do Zero',  mentor: 'Alessandro',   price: '397', tag: 'NOVO', category: 'Negócios',  image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80' },
];

export const MENTORIAS = COURSES.filter(c => c.category === 'Mentoria');