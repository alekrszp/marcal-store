# Marçal Store — Frontend (React Native / Expo)

App mobile de e-commerce de produtos digitais (cursos e mentorias), feito em
**React Native + Expo SDK 54**. Inclui catálogo, autenticação, área
administrativa com CRUD de produtos, carrinho de compras, checkout,
comprovante de compra e histórico de pedidos.

> Este README documenta a parte **frontend** do projeto. Para o passo a passo
> de integração com backend/API e banco de dados, veja
> [`INTEGRACAO_BACKEND.md`](./INTEGRACAO_BACKEND.md).

---

## Stack

- **React Native 0.81** + **Expo ~54**
- **React Navigation** (`@react-navigation/native-stack`) — navegação entre telas
- **Context API** — estado global (usuário logado, carrinho)
- **AsyncStorage** (`@react-native-async-storage/async-storage`) — persistência local
- **react-native-svg** — ícones e logo (não há `@expo/vector-icons` no projeto)
- **expo-image-picker** — seleção de imagens da galeria (avatar e imagens de produto)
- **expo-video** — reprodução de vídeos (publi da Home e aulas em "Meus Cursos")

---

## Como rodar o projeto

```bash
npm install
npx expo start
```

No terminal do Expo:
- `r` — recarrega o app
- `a` — abre no emulador Android
- `i` — abre no simulador iOS
- Escaneie o QR code com o app **Expo Go** para testar no celular

O app funciona **100% offline/mock** por padrão (sem backend nem banco de
dados) — todos os dados são simulados via `src/data/*` e persistidos
localmente no AsyncStorage do dispositivo.

---

## Estrutura de pastas

```
src/
├── components/   # Componentes de UI puros (sem lógica de negócio/storage)
├── context/      # Estado global via Context API (UserContext, CartContext)
├── data/         # Dados mock / seed (produtos, usuário, lista de admins)
├── hooks/        # Hooks customizados (estado, side effects, integrações)
├── navigation/   # Configuração de rotas (React Navigation)
├── screens/      # Telas — orquestram hooks/context e componentes
├── services/     # Comunicação com "API" (mock ou real via httpClient)
├── storage/      # Único ponto de acesso ao AsyncStorage
└── theme/        # Design tokens (cores, espaçamentos, tipografia, estilos globais)
```

### Por que essa separação?

| Camada       | Responsabilidade                                                                 | Não pode fazer |
|--------------|-----------------------------------------------------------------------------------|----------------|
| `components` | UI pura. Recebe dados via props, emite eventos via callbacks.                     | Acessar storage, fazer fetch, conter regra de negócio |
| `screens`    | Orquestração. Consome hooks/context e monta a tela com os componentes.            | Lógica de negócio extensa, chamadas de API complexas direto |
| `hooks`      | Estado, efeitos colaterais, regras de carregamento. Expõem `isLoading`/`hasError`. | — |
| `context`    | Estado global compartilhado entre telas (usuário, carrinho).                      | — |
| `services`   | Comunicação com API/backend e mapeamento de resposta.                             | Lógica visual |
| `storage`    | Único ponto de acesso ao AsyncStorage.                                             | — |

---

## Funcionalidades

### Autenticação (mock)
- **Welcome / Login / Cadastro** (`WelcomeScreen`, `LoginScreen`, `CadastroScreen`)
- Sessão simulada via `userService` + `UserContext`, token salvo em AsyncStorage
- "Esqueci minha senha" simulado (`requestPasswordReset`)
- **Admin**: e-mails da lista `src/data/admin.js` (`ADMIN_EMAILS`) recebem
  `role: 'admin'` automaticamente no login/cadastro

### Catálogo de produtos
- **Home** (`HomeScreen`) — seção "Em destaque" com os produtos
- **Produtos** (`ProdutosScreen`) — listagem filtrada por categoria; o título
  da tela mostra o nome da categoria selecionada (ou "PRODUTOS" em "Todos")
- **Detalhe do produto** (`ProdutoDetailScreen`) — descrição, módulos, carga
  horária, preço e botão "ADICIONAR AO CARRINHO" (ou aviso "VOCÊ JÁ TEM ESSE
  CURSO" se o produto já estiver no histórico de pedidos)
- Categorias e produtos persistidos via `produtoService` (seed inicial em
  `src/data/produtos.js`)

### Área administrativa (CRUD de produtos)
- Acesso via botão "ÁREA ADMIN" no Perfil (somente para `role === 'admin'`)
- **AdminProdutosScreen** — lista todos os produtos com ações Editar/Excluir
- **AdminProdutoFormScreen** — formulário de criação/edição (`useProdutoForm`),
  incluindo seletor de imagem da galeria e editor de módulos (`ModulosEditor`)

### Carrinho de compras
- `CartContext` — estado global do carrinho (itens, total), persistido via
  `cartService`
- **Cada curso só pode ser comprado 1 vez**: `addItem` não permite duplicar
  um produto já no carrinho, e `ProdutoDetailScreen` mostra "VOCÊ JÁ TEM ESSE
  CURSO" (sem opção de compra) se ele já estiver no histórico de pedidos
- Ícone de carrinho com badge na Home (`CartButton`)
- **CartScreen** — lista de itens (`CartItemRow`) com remoção e total (sem
  seleção de quantidade)

### Checkout, comprovante e histórico
- **CheckoutScreen** — resumo do pedido + seleção de forma de pagamento
  (Pix / Cartão de Crédito / Boleto)
- Ao confirmar: cria o pedido (`orderService.createOrder`), limpa o carrinho
  e navega para o comprovante
- **ReceiptScreen** — comprovante da compra (itens, pagamento, total, data)
- **OrderHistoryScreen** — histórico de pedidos anteriores (acessível pelo
  Perfil → "HISTÓRICO DE COMPRAS"), cada item abre o comprovante novamente

### Vídeos: publi da Home e Meus Cursos
- **Botão "VÍDEO" (Home)** — abre em tela cheia (`VideoPlayerScreen`, via
  `expo-video`) o vídeo de divulgação gerado por IA com o Pablo Marçal
  (`src/data/promo.js`, asset local em `assets/videos/`)
- **Botão "MEUS CURSOS" (Home)** → `MeusCursosScreen` — lista, com
  `CursoVideoCard`, apenas os produtos que o cliente **já comprou** e que
  possuem `video` cadastrado (aula do curso). A lista é calculada pelo hook
  `useMeusCursos`, que cruza `orderService.getOrders()` com
  `produtoService.getProdutos()`
- Tocar em um curso abre a aula em `VideoPlayerScreen`
- **Cadastro do vídeo da aula**: no formulário do admin
  (`AdminProdutoFormScreen` / `ProdutoFormFields`), o campo opcional "Vídeo
  da aula" usa `ProdutoVideoPicker` para **selecionar um vídeo da galeria do
  dispositivo** (mesmo padrão da imagem do produto) — recomendado `.mp4`
  (H.264), até 1080p e ~50MB. Na integração com backend, esse arquivo é
  enviado por upload e o campo `video` passa a guardar a URL retornada
  (`.mp4`/`.m3u8`)
- Por enquanto, apenas 2 produtos do seed (`src/data/produtos.js`) têm
  `video` de exemplo: "A Arte de Vender" e "Mindset Vencedor"

---

## Design system (`src/theme`)

Todos os estilos usam tokens de `src/theme/index.js` — **sem estilos
inline** e **sem valores "mágicos"** espalhados pelo código.

| Token        | Valores |
|--------------|---------|
| `colors`     | `background #000`, `surface #0F0F0F`, `primary #0A6B3E`, `textPrimary #FFF`, `textSecondary #666`, `danger #FF3B3B`, entre outros |
| `spacing`    | `xs 4, sm 8, md 16, lg 24, xl 36, xxl 56` |
| `radius`     | `sm 4, md 10, lg 18, xl 28, full 999` |
| `typography` | `h1`–`h4`, `subtitle`, `body`, `bodyBold`, `small`, `caption`, `micro`, `nano`, `tiny`, `button`, `label` |

`src/theme/globalStyles.js` reúne estilos compartilhados entre telas
(`screen`, `scrollContent`, `backButton`, `backText`, `footerRow`,
`sectionHeader`, etc.).

---

## Modo mock vs. modo API real

Tudo é controlado por uma única flag em `src/services/config.js`:

```js
export const USE_MOCK = true; // false = usa httpClient + API_URL
```

Com `USE_MOCK = true` (padrão atual):
- Não precisa de backend nem banco de dados
- Produtos, carrinho, pedidos e usuário ficam salvos no AsyncStorage do
  dispositivo (`src/storage/asyncStorageHelper.js`)
- Os dados de `src/data/*` servem como "seed" inicial

Com `USE_MOCK = false`:
- Todas as chamadas passam a usar `src/services/httpClient.js` contra `API_URL`
- Cada `service` (`userService`, `produtoService`, `cartService`,
  `orderService`) já tem blocos `// INTEGRAÇÃO:` documentando rota, método,
  body e resposta esperada para cada endpoint

Veja o passo a passo completo em [`INTEGRACAO_BACKEND.md`](./INTEGRACAO_BACKEND.md).

---

## Observações importantes

- **Carrinho e pedidos são por dispositivo** enquanto `USE_MOCK = true`
  (não há sincronização entre usuários/dispositivos). Isso é esperado para o
  escopo do projeto e está documentado para evolução futura via API.
- **Tokens de autenticação** ficam no AsyncStorage em modo mock. Para
  produção, recomenda-se migrar para `expo-secure-store` (ver comentário em
  `src/storage/asyncStorageHelper.js`).
- Não há biblioteca de ícones tipo `@expo/vector-icons` — todos os ícones
  (`Logo`, `CartIcon`) são SVGs próprios via `react-native-svg`.
