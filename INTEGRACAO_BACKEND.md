# Guia de Integração com Backend e Banco de Dados

Este documento descreve, passo a passo, como conectar o frontend (este
projeto) a um backend real com banco de dados, substituindo o modo mock
atual (`USE_MOCK = true`).

O frontend já está **preparado** para essa migração: cada `service` tem
blocos de comentário `// INTEGRAÇÃO:` descrevendo exatamente a rota, o
método HTTP, o body esperado e o formato da resposta. Este guia organiza
esse trabalho em uma ordem prática.

---

## Visão geral da migração

1. Subir o backend com os endpoints descritos abaixo
2. Trocar `USE_MOCK` para `false` em `src/services/config.js`
3. Apontar `API_URL` para o servidor
4. Testar fluxo por fluxo (autenticação → produtos → carrinho → pedidos)
5. (Opcional) Migrar token para `expo-secure-store`

Nenhum componente, screen ou hook precisa mudar — toda a integração fica
isolada na camada `src/services/`.

---

## Passo 0 — Configuração central

### `src/services/config.js`
```js
export const USE_MOCK = false;
export const API_URL  = 'https://api.marcalstore.com.br'; // ajustar para o seu backend
```

> ⚠️ Sempre usar **HTTPS** em produção. `http://` só é aceitável em
> desenvolvimento local (ex: `http://192.168.x.x:3000`).

### `src/services/httpClient.js`
Já centraliza:
- Montagem da URL (`API_URL + endpoint`)
- Header `Authorization: Bearer <token>` (lido do AsyncStorage)
- Parse de erro no formato `{ message: string }`
- Tratamento de sessão expirada (401 → limpa storage e força novo login)

**Ação necessária**: o backend deve responder erros como
`{ "message": "mensagem amigável" }`. Se usar outro formato (`{ error }`,
`{ errors: [...] }`), ajustar a função `extractErrorMessage` neste arquivo.

---

## Passo 1 — Autenticação e usuário (`src/services/userService.js`)

### Modelo de dados — Usuário
```ts
{
  id:     string,
  nome:   string,
  email:  string,
  avatar?: string,   // URL da imagem
  role?:  'admin' | 'cliente',
}
```

### Endpoints a implementar

| Função              | Endpoint                       | Método | Body                          | Resposta                                  | Observações |
|---------------------|---------------------------------|--------|--------------------------------|--------------------------------------------|-------------|
| `login`             | `/api/auth/login`               | POST   | `{ email, senha }`             | `{ token, refreshToken?, user }`           | Erro 401 com `{ message: 'E-mail ou senha incorretos' }` |
| `register`          | `/api/auth/register`            | POST   | `{ nome, email, senha }`       | `{ token, user }`                          | Erro 409 com `{ message: 'E-mail já cadastrado' }` |
| `getUser`           | `/api/auth/me`                  | GET    | —                               | `{ id, nome, email, avatar?, role? }`      | Usado para restaurar sessão ao abrir o app |
| `updateAvatar`      | `/api/auth/me/avatar`           | PATCH  | `FormData` (campo `avatar`)    | —                                            | `multipart/form-data`, não passa pelo `httpClient` |
| `requestPasswordReset` | `/api/auth/forgot-password`  | POST   | `{ email }`                    | `{ success: true }`                        | Backend envia e-mail com link/código |
| `logout` (opcional) | `/api/auth/logout`              | POST   | —                               | —                                            | Para invalidar `refreshToken` no servidor |

### Banco de dados
Tabela `users`:
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  senha_hash    VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(20) NOT NULL DEFAULT 'cliente', -- 'cliente' | 'admin'
  created_at    TIMESTAMP DEFAULT now()
);
```

### Papel de admin (`role`)
- Hoje (mock), `src/data/admin.js` define `ADMIN_EMAILS` e o `userService`
  calcula `role` no login/cadastro a partir dessa lista.
- **Com backend real**: o campo `role` deve vir pronto do backend (coluna
  `role` na tabela `users`, definida manualmente ou por um endpoint
  administrativo). `src/data/admin.js` deixa de ser usado — pode ser
  removido após a migração.

### Refresh token (opcional, recomendado)
- Se o backend retornar `refreshToken` no login/cadastro, salvar com
  `storage.save(storage.KEYS.REFRESH_TOKEN, data.refreshToken)` (já há um
  comentário indicando onde fazer isso em `userService.js`).
- Implementar a renovação em `httpClient.js`, no bloco que trata `401`
  (`POST /api/auth/refresh` com o `refreshToken` salvo).

---

## Passo 2 — Produtos (`src/services/produtoService.js`)

### Modelo de dados — Produto
```ts
{
  id:            string,
  title:         string,
  mentor:        string,
  price:         number,
  tag?:          string,        // ex: 'TOP', 'NOVO'
  category:      string,
  image:         string,        // URL da imagem
  descricao?:    string,
  cargaHoraria?: string,        // ex: '32h'
  modulos?:      string[],
}
```

### Endpoints a implementar

| Função            | Endpoint                  | Método | Body                | Resposta              |
|-------------------|----------------------------|--------|----------------------|------------------------|
| `getProdutos`     | `/api/produtos?category=X` | GET    | —                    | `Array<Produto>`       |
| `getCategories`   | `/api/categories`           | GET    | —                    | `Array<string>`        |
| `createProduto`   | `/api/produtos`             | POST   | `Produto` (sem `id`) | `Produto` criado (com `id`) |
| `updateProduto`   | `/api/produtos/:id`         | PUT    | `Produto`            | `Produto` atualizado   |
| `deleteProduto`   | `/api/produtos/:id`         | DELETE | —                    | `204 No Content`       |

Todas as rotas (exceto se for decidido tornar o catálogo público) devem
exigir `Authorization: Bearer <token>` — o `httpClient` já envia esse header
automaticamente.

> **Autorização do CRUD**: o backend deve validar que apenas usuários com
> `role === 'admin'` consigam chamar `createProduto`/`updateProduto`/`deleteProduto`.
> O frontend já restringe a navegação para a área admin, mas a validação
> real de permissão **precisa existir no backend**.

### Upload de imagem do produto
- No app, a imagem é escolhida da galeria (`useImagePicker`) e fica como
  uma URI local (`file://...`) no formulário.
- Para integrar: antes de `createProduto`/`updateProduto`, fazer upload da
  imagem em uma requisição separada (igual a `userService.updateAvatar`,
  com `FormData`/`multipart/form-data`) e usar a **URL retornada pelo
  backend** no campo `image` antes de enviar o restante dos dados do produto.

### Banco de dados
Tabela `produtos`:
```sql
CREATE TABLE produtos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          VARCHAR(255) NOT NULL,
  mentor         VARCHAR(255) NOT NULL,
  price          NUMERIC(10,2) NOT NULL,
  tag            VARCHAR(20),
  category       VARCHAR(100) NOT NULL,
  image_url      TEXT NOT NULL,
  descricao      TEXT,
  carga_horaria  VARCHAR(20),
  modulos        JSONB,           -- array de strings
  created_at     TIMESTAMP DEFAULT now()
);
```
Categorias podem ser uma tabela separada (`categorias`) ou um `enum`/lista
fixa, dependendo da necessidade de o admin criar novas categorias.

### Seed inicial
`src/data/produtos.js` (`PRODUTOS`, `CATEGORIES`) pode ser usado como dados
de seed para popular a tabela `produtos` na primeira migração.

---

## Passo 3 — Carrinho (`src/services/cartService.js`)

### Modelo de dados — Item do carrinho
```ts
{ id, title, mentor, price, image, quantity }
```

### Endpoints a implementar

| Função     | Endpoint     | Método | Body              | Resposta            |
|------------|--------------|--------|--------------------|----------------------|
| `getCart`  | `/api/cart`  | GET    | —                  | `Array<CartItem>`    |
| `saveCart` | `/api/cart`  | PUT    | `Array<CartItem>`  | —                    |

Ambas exigem `Authorization: Bearer <token>` — o carrinho é por usuário, não
por dispositivo.

### Banco de dados
Tabela `carrinho_itens`:
```sql
CREATE TABLE carrinho_itens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  produto_id  UUID NOT NULL REFERENCES produtos(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  UNIQUE (user_id, produto_id)
);
```
- `GET /api/cart` faz join com `produtos` para retornar `title, mentor,
  price, image` atualizados (em vez de valores "congelados" salvos no
  cliente).
- `PUT /api/cart` substitui (upsert) os itens do usuário autenticado.

> Alternativa mais simples (sem tabela própria): manter o carrinho como
> JSON em uma coluna `cart_json` na tabela `users`. Funciona, mas perde a
> integridade referencial com `produtos`.

---

## Passo 4 — Pedidos / Comprovante / Histórico (`src/services/orderService.js`)

### Modelo de dados — Pedido
```ts
{
  id:            string,
  date:          string,   // ISO 8601
  items:         Array<{ id, title, mentor, price, quantity }>,
  paymentMethod: string,   // 'Pix' | 'Cartão de Crédito' | 'Boleto'
  total:         number,
}
```

### Endpoints a implementar

| Função        | Endpoint      | Método | Body                                   | Resposta                          |
|---------------|---------------|--------|------------------------------------------|--------------------------------------|
| `getOrders`   | `/api/orders` | GET    | —                                          | `Array<Order>` (mais recente primeiro) |
| `createOrder` | `/api/orders` | POST   | `{ items, paymentMethod, total }`         | `Order` criado (com `id` e `date` gerados pelo backend) |

Ambas exigem `Authorization: Bearer <token>`.

### Banco de dados
```sql
CREATE TABLE pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  payment_method  VARCHAR(50) NOT NULL,
  total           NUMERIC(10,2) NOT NULL,
  created_at      TIMESTAMP DEFAULT now()
);

CREATE TABLE pedido_itens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id   UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id  UUID NOT NULL REFERENCES produtos(id),
  title       VARCHAR(255) NOT NULL,  -- "congelado" no momento da compra
  mentor      VARCHAR(255) NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  quantity    INTEGER NOT NULL
);
```

> Importante: salvar `title`/`mentor`/`price` **no momento da compra** (não
> apenas referenciar `produto_id`), pois o produto pode mudar de preço ou
> ser excluído depois — o comprovante deve refletir o que foi comprado.

### Lógica recomendada do `POST /api/orders`
1. Validar que o usuário está autenticado
2. Recalcular o `total` no backend a partir dos preços atuais dos
   `produtos` (não confiar apenas no `total` enviado pelo app)
3. Criar registro em `pedidos` + `pedido_itens`
4. Esvaziar o carrinho do usuário (`DELETE FROM carrinho_itens WHERE user_id = ...`)
5. Retornar o pedido criado no formato `Order` esperado pelo app

---

## Passo 5 — Checklist final de migração

- [ ] Backend no ar com todos os endpoints acima implementados
- [ ] `USE_MOCK = false` e `API_URL` apontando para o servidor (HTTPS)
- [ ] Erros do backend no formato `{ message: string }` (ou ajustar
      `extractErrorMessage` em `httpClient.js`)
- [ ] Testar **Cadastro → Login → restauração de sessão** (fechar e reabrir o app)
- [ ] Testar **catálogo** (Home, Produtos, Detalhe)
- [ ] Testar **CRUD admin** com um usuário `role: 'admin'` e bloqueio para `role: 'cliente'`
- [ ] Testar **upload de imagem** (avatar e produto) via multipart
- [ ] Testar **carrinho** persistindo entre sessões/dispositivos do mesmo usuário
- [ ] Testar **checkout → comprovante → histórico** com recálculo de total no backend
- [ ] Remover `src/data/admin.js` (role agora vem do backend) e, opcionalmente,
      `src/data/produtos.js`/`src/data/user.js` (mantidos só como referência/seed)
- [ ] (Opcional) Migrar `TOKEN`/`REFRESH_TOKEN` para `expo-secure-store`
- [ ] (Opcional) Implementar refresh token automático em `httpClient.js`
