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

export const CATEGORIES = ['Todos', 'Mentoria', 'Negócios', 'Mindset', 'Vendas', 'Liderança'];

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
    id: '2', title: 'Gestão de Elite', mentor: 'Alessandro', price: 697, category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
    descricao: 'Aprenda a gerir equipes de alta performance, tomar decisões estratégicas e escalar seu negócio com metodologias comprovadas.',
    cargaHoraria: '24h',
    modulos: ['Liderança Situacional', 'Gestão de Times', 'KPIs e Métricas', 'Tomada de Decisão', 'Escala e Crescimento'],
  },
  {
    id: '3', title: 'Vendas na Prática', mentor: 'Felipe', price: 597, tag: 'NOVO', category: 'Vendas',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
    descricao: 'Do primeiro contato ao fechamento. Técnicas modernas de vendas consultivas que geram resultados consistentes e escaláveis.',
    cargaHoraria: '20h',
    modulos: ['Prospecção Ativa', 'Qualificação de Leads', 'Apresentação de Valor', 'Objeções e Contorno', 'Fechamento e Pós-venda'],
  },
  {
    id: '4', title: 'Liderança Total', mentor: 'Pedro', price: 797, category: 'Liderança',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    descricao: 'Desenvolva autoridade, influência e carisma para liderar com excelência em qualquer ambiente — pessoal ou profissional.',
    cargaHoraria: '28h',
    modulos: ['Autoconhecimento do Líder', 'Comunicação Poderosa', 'Gestão de Conflitos', 'Cultura de Alta Performance', 'Legado e Impacto'],
  },
  {
    id: '5', title: 'Mindset Vencedor', mentor: 'Terence Fletcher', price: 497, tag: 'TOP', category: 'Mindset',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    descricao: 'Reprograme sua mente para a vitória. Disciplina, foco e resiliência como ferramentas diárias para alcançar resultados extraordinários.',
    cargaHoraria: '18h',
    modulos: ['Disciplina como Estilo de Vida', 'Foco e Produtividade', 'Resiliência Mental', 'Rotina de Campeão', 'Mentalidade Anti-Frágil'],
    video: require('../../assets/videos/curso-mindset-vencedor.mp4'),
  },
  {
    id: '6', title: 'Finanças do Zero', mentor: 'Alessandro', price: 397, tag: 'NOVO', category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80',
    descricao: 'Organize sua vida financeira, elimine dívidas, construa reservas e comece a investir mesmo começando do absoluto zero.',
    cargaHoraria: '16h',
    modulos: ['Diagnóstico Financeiro', 'Eliminação de Dívidas', 'Orçamento Inteligente', 'Reserva de Emergência', 'Primeiros Investimentos'],
  },
];

export const MENTORIAS = PRODUTOS.filter(p => p.category === 'Mentoria');
