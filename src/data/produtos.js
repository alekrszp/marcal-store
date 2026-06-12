// INTEGRAÇÃO: substituir este arquivo por chamadas reais à API
// Endpoint esperado: GET /api/produtos → Array<Produto>
// Endpoint esperado: GET /api/categories → Array<string>
// Modelo Produto: { id, title, mentor, price, tag?, category, image, descricao?, cargaHoraria?, modulos?, video? }
//
// "video" (opcional): URL/arquivo do vídeo da AULA do curso (conteúdo pago,
// não é vídeo de divulgação). Quando presente, e o cliente já comprou o
// produto (aparece em algum pedido do histórico), o curso passa a aparecer
// em "Meus Cursos" (MeusCursosScreen), de onde a aula pode ser assistida.
//
// Esta lista também serve como "seed" inicial dos produtos persistidos
// localmente (ver produtoService.js) — o admin pode editar/excluir/criar
// produtos a partir dela.

export const CATEGORIES = ['Todos', 'Mentoria', 'Mindset'];

export const PRODUTOS = [
  {
    id: '1', title: 'A Arte de Vender', mentor: 'Jordan Belfort', price: 997, tag: 'TOP', category: 'Mentoria',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    descricao: 'Domine a arte da venda: da prospecção ao fechamento. As técnicas, os scripts e a mentalidade que fazem Jordan Belfort um dos maiores vendedores do mundo.',
    cargaHoraria: '32h',
    modulos: ['Mentalidade do Vendedor de Elite', 'Prospecção e Conexão', 'Storytelling de Vendas', 'Quebra de Objeções', 'Fechamento e Follow-up'],
    video: require('../../assets/videos/curso-arte-de-vender.mp4'),
  },
  {
    id: '5', title: 'Mindset Vencedor', mentor: 'Terence Fletcher', price: 497, tag: 'TOP', category: 'Mindset',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    descricao: 'Reprograme sua mente para a vitória. Disciplina, foco e resiliência como ferramentas diárias para alcançar resultados extraordinários.',
    cargaHoraria: '18h',
    modulos: ['Disciplina como Estilo de Vida', 'Foco e Produtividade', 'Resiliência Mental', 'Rotina de Campeão', 'Mentalidade Anti-Frágil'],
    video: require('../../assets/videos/curso-mindset-vencedor.mp4'),
  },
];

export const MENTORIAS = PRODUTOS.filter(p => p.category === 'Mentoria');
