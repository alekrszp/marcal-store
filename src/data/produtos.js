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
    descricao: 'No dia a dia do escritório, Jordan recebe um cliente que parecia impossível de fechar — uma venda que qualquer outro vendedor deixaria escapar. Mas, na conversa, ele muda o tom, conduz a objeção e transforma um "não" quase certo em um "sim" — deixando até os colegas impressionados com a cena. Esse curso ensina exatamente essa técnica: como ler o cliente, ajustar o discurso na hora e fechar vendas que pareciam perdidas, usando a forma de falar como sua maior ferramenta.',
    cargaHoraria: '2 min',
    modulos: ['A Regra de Ouro: Venda Você Primeiro', 'Construindo Autoridade Instantânea', 'O Discurso que Hipnotiza a Sala', 'Lendo o Comprador em Segundos', 'O Fechamento Irresistível'],
    video: require('../../assets/videos/curso-arte-de-vender.mp4'),
    videoDescricao: 'A aula mostra Jordan no escritório fechando uma venda que parecia impossível — e impressionando até os próprios colegas com a forma como conduziu o cliente.',
  },
  {
    id: '5', title: 'Mindset Vencedor', mentor: 'Terence Fletcher', price: 497, tag: 'TOP', category: 'Mindset',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
    descricao: 'Uma sequência de momentos que mostram, na prática, o que significa ter um mindset vencedor: a exigência implacável de um mentor que não aceita "bom o suficiente", a pressão que separa quem desiste de quem vai até o limite, e a obsessão pela perfeição em cada detalhe. Esse curso usa esses momentos para ensinar a mentalidade por trás da alta performance — como lidar com pressão extrema, transformar críticas em combustível e desenvolver a disciplina de quem está disposto a pagar o preço da excelência.',
    cargaHoraria: '6 min',
    modulos: ['Disciplina Brutal: Sem Desculpas', 'A Obsessão pela Perfeição', 'Pressão Como Combustível', 'Superando o Próprio Limite', 'A Mentalidade de Quem Nunca Desiste'],
    video: require('../../assets/videos/curso-mindset-vencedor.mp4'),
    videoDescricao: 'Uma montagem de cenas de Whiplash mostrando a exigência implacável de Terence Fletcher e a mentalidade de quem não aceita menos que a perfeição.',
  },
];
