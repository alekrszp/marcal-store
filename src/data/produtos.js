// INTEGRAÇÃO: substituir este arquivo por chamadas reais à API
// Endpoint esperado: GET /api/produtos → Array<Produto>
// Endpoint esperado: GET /api/categories → Array<string>
// Modelo Produto: { id, title, mentor, price, tag?, category, image, descricao?, cargaHoraria?, modulos?, video?, videoDescricao? }
//
// "video" (opcional): arquivo/URL do vídeo da AULA do curso (conteúdo pago,
// não é vídeo de divulgação), escolhido pelo admin via ProdutoVideoPicker
// (.mp4/H.264, recomendado até 1080p e ~50MB — ver produtoService.js para a
// especificação completa e o fluxo de upload na integração). Quando presente,
// e o cliente já comprou o produto (aparece em algum pedido do histórico), o
// curso passa a aparecer em "Meus Cursos" (MeusCursosScreen), de onde a aula
// pode ser assistida.
//
// "videoDescricao" (opcional): texto curto contando o que acontece nessa
// aula especificamente (diferente de "descricao", que descreve o curso como
// um todo). Exibido em "Meus Cursos" (CursoVideoCard), abaixo do mentor.
//
// "cargaHoraria": para os 2 cursos de exemplo (com "video"), reflete a
// duração real do arquivo de vídeo (ex: '2 min'), já que cada um tem apenas
// uma aula. Para cursos sem vídeo, representa a carga horária total do
// curso (ex: '24h').
//
// Esta lista também serve como "seed" inicial dos produtos persistidos
// localmente (ver produtoService.js) — o admin pode editar/excluir/criar
// produtos a partir dela.

// Categorias que a loja vende. "Mentoria" e "Mindset" já têm produtos no
// seed; "Negócios", "Vendas" e "Liderança" ficam disponíveis para o admin
// cadastrar novos produtos mesmo sem nenhum produto ainda nessas categorias.
export const CATEGORIES = ['Todos', 'Mentoria', 'Mindset', 'Negócios', 'Vendas', 'Liderança'];

// Sempre que este seed (PRODUTOS) for alterado de forma relevante durante o
// desenvolvimento, incremente este número. produtoService usa isso para
// resetar os produtos salvos no AsyncStorage e refletir o novo seed (em
// produção/com API real isso não tem efeito).
export const PRODUTOS_SEED_VERSION = 4;

export const PRODUTOS = [
  {
    id: '1', title: 'A Arte de Vender', mentor: 'Jordan Belfort', price: 997, tag: 'TOP', category: 'Mentoria',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80',
    descricao: 'Baseado na cena mais icônica do mundo das vendas: a apresentação que hipnotiza qualquer sala e vende a ideia antes do produto. Aprenda a técnica por trás do carisma, da confiança inabalável e do fechamento que parece impossível de recusar.',
    cargaHoraria: '2 min',
    modulos: ['A Regra de Ouro: Venda Você Primeiro', 'Construindo Autoridade Instantânea', 'O Discurso que Hipnotiza a Sala', 'Lendo o Comprador em Segundos', 'O Fechamento Irresistível'],
    video: require('../../assets/videos/curso-arte-de-vender.mp4'),
    videoDescricao: 'A cena que virou referência em vendas: a apresentação que hipnotiza a sala, vende a ideia antes do produto e mostra a confiança de quem domina a arte de vender.',
  },
  {
    id: '5', title: 'Mindset Vencedor', mentor: 'Terence Fletcher', price: 497, tag: 'TOP', category: 'Mindset',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
    descricao: 'A mentalidade de quem não aceita "bom o suficiente": disciplina brutal, exigência implacável com você mesmo e a busca obsessiva pela perfeição em cada detalhe — até encontrar seu limite real e ultrapassá-lo.',
    cargaHoraria: '6 min',
    modulos: ['Disciplina Brutal: Sem Desculpas', 'A Obsessão pela Perfeição', 'Pressão Como Combustível', 'Superando o Próprio Limite', 'A Mentalidade de Quem Nunca Desiste'],
    video: require('../../assets/videos/curso-mindset-vencedor.mp4'),
    videoDescricao: 'A cena que mostra o que é exigência de verdade: o limite sendo empurrado até o ponto de quebra, e a mentalidade implacável de quem não aceita menos que a perfeição.',
  },
];
