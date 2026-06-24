# Guia de Integração com Backend (Microservices)

Este documento descreve como o frontend se conecta ao backend desenvolvido
em Spring Boot + Go com arquitetura de microservices.

---

## Visão geral

O app se comunica exclusivamente com o **gateway-service** (Spring Cloud Gateway),
que roteia as requisições para os microservices corretos e protege as rotas
`/ws/**` com autenticação JWT.

```
App React Native
     │
     ▼
gateway-service  (porta 8765)
     ├─► auth-service      → /auth/**
     ├─► product-service   → /products/** e /ws/products/**
     ├─► currency-service  → /currency/**
     └─► order-service     → /ws/orders/**
```

---

## Configuração central — `src/services/config.js`

```js
export const USE_MOCK = false;

// Android Emulator → 10.0.2.2 | iOS Simulator → localhost
export const API_URL = 'http://<host>:8765';
```

O host é detectado automaticamente via Expo Go (`debuggerHost` = IP da máquina na Wi‑Fi).
Para emuladores: Android `10.0.2.2`, iOS `localhost`.

Se ainda falhar, defina manualmente em `src/services/config.js`:
```js
const API_HOST_OVERRIDE = '192.168.x.x'; // ipconfig no Windows
```

**Requisitos no celular físico:**
- PC e celular na **mesma rede Wi‑Fi**
- Backend rodando (`docker compose up -d`)
- Firewall do Windows permitindo porta **8765**

---

## Autenticação — `src/services/userService.js`

### auth-service

| Função     | Endpoint        | Método | Body                        | Resposta                    |
|------------|-----------------|--------|-----------------------------|-----------------------------|
| `login`    | `/auth/signin`  | POST   | `{ email, password }`       | `{ user, token }`           |
| `register` | `/auth/signup`  | POST   | `{ name, email, password }` | `UserEntity` (sem token)    |

> Após o cadastro, o frontend chama `/auth/signin` automaticamente para obter o JWT.
> Avatar é salvo apenas localmente (sem endpoint no auth-service).

### JWT — claims esperados

| Claim   | Uso                                      |
|---------|------------------------------------------|
| `id`    | ID do usuário                            |
| `email` | E-mail do usuário                        |
| `type`  | `0` = Admin, `1` = Common (role no app)  |

---

## Produtos — `src/services/produtoService.js`

### product-service

| Função           | Endpoint                                      | Método | Auth | Resposta              |
|------------------|-----------------------------------------------|--------|------|-----------------------|
| `getProdutos`    | `/products?targetCurrency=BRL&page=0&size=100`| GET    | Não  | `Page<Product>` → `.content` |
| `getCategories`  | derivado da lista de produtos                 | GET    | Não  | `Array<string>`       |
| `createProduto`  | `/ws/products`                                | POST   | JWT  | Produto criado        |
| `updateProduto`  | `/ws/products/{id}`                           | PUT    | JWT  | Produto atualizado    |
| `deleteProduto`  | `/ws/products/{id}`                           | DELETE | JWT  | 204 No Content        |

### Mapeamento de campos

| App (frontend)  | Backend           | Observação                          |
|-----------------|-------------------|-------------------------------------|
| `title`         | `name`            |                                     |
| `mentor`        | `instructor`      |                                     |
| `image`         | `imageUrl`        | URL pública (string)                |
| `video`         | `videoUrl`        | URL pública (string)                |
| `descricao`     | `description`     |                                     |
| `cargaHoraria`  | `workload`        | string `"24h"` ↔ inteiro `24`       |
| `modulos`       | `modules`         | array de títulos ↔ contagem inteira |
| `price`         | `convertedPrice`  | quando `targetCurrency=BRL`         |
| `category`      | —                 | apenas local (backend não possui)   |

---

## Pedidos — `src/services/orderService.js`

### order-service

| Função        | Endpoint                              | Método | Auth | Body                              |
|---------------|---------------------------------------|--------|------|-----------------------------------|
| `getOrders`   | `/ws/orders?targetCurrency=BRL`       | GET    | JWT  | —                                 |
| `createOrder` | `/ws/orders`                          | POST   | JWT  | `{ items: [{ productId, quantity }] }` |

### Mapeamento de campos (resposta)

| App (frontend)  | Backend                |
|-----------------|------------------------|
| `id`            | `id`                   |
| `date`          | `orderDate`            |
| `total`         | `totalConvertedPrice`  |
| `items[].id`    | `items[].productId`    |
| `paymentMethod` | apenas local (UI)      |

---

## Carrinho — `src/services/cartService.js`

O carrinho **não possui microservice** — permanece no AsyncStorage local
mesmo com `USE_MOCK = false`. Apenas pedidos e catálogo usam a API.

---

## Rotas protegidas (JWT)

O gateway bloqueia `/ws/**` e exige token válido. O `httpClient` envia
automaticamente `Authorization: Bearer <token>`.

Rotas **públicas**:
- `POST /auth/signin`
- `POST /auth/signup`
- `GET /products?targetCurrency=BRL`

---

## Executando o projeto

```bash
# 1. Backend (em marcal-store-backend/)
docker compose up -d --build

# 2. Frontend (em marcal-store-frontend/)
npm install
npx expo start
```

Verifique o Eureka em `http://localhost:8761` e o gateway em
`http://localhost:8765/actuator/health`.

Para device físico, ajuste `API_URL` em `src/services/config.js` com o IP
da máquina na rede local.

---

## Admin

Usuários com `type: 0` (Admin) no JWT podem acessar o CRUD de produtos
via `/ws/products/**`. Cadastre um admin diretamente no banco `db_user`
ou altere o `type` do usuário para `0`.
