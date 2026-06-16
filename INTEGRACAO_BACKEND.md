# Guia de Integração com Backend (Microservices)

Este documento descreve como o frontend se conecta ao backend desenvolvido
em Spring Boot com arquitetura de microservices.

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
     ├─► product-service   → /products/** e /ws/product/**
     └─► order-service     → /ws/orders/**
```

---

## Configuração central — `src/services/config.js`

```js
// USE_MOCK = false → integração real com o gateway
// USE_MOCK = true  → dados locais (sem backend)
export const USE_MOCK = false;

// Android Emulator acessa o host via 10.0.2.2
// iOS Simulator / Expo Web: trocar para http://localhost:8765
export const API_URL = 'http://10.0.2.2:8765';
```

---

## Autenticação — `src/services/userService.js`

### auth-service

| Função     | Endpoint        | Método | Body                            | Resposta          |
|------------|-----------------|--------|---------------------------------|-------------------|
| `login`    | `/auth/signin`  | POST   | `{ email, password }`           | `{ token, ... }`  |
| `register` | `/auth/signup`  | POST   | `{ name, email, password }`     | `{ token, ... }`  |

> O auth-service não expõe endpoint `/me`. Os dados do usuário são extraídos
> do payload JWT (`_decodeUserFromToken`) e persistidos no AsyncStorage.
> Avatar é salvo apenas localmente (sem endpoint de upload no auth-service).

### Formato do token
O frontend aceita `{ token }` ou `{ accessToken }` na resposta do login/signup.
Se o backend retornar apenas a string do token, também funciona.
O payload JWT deve conter: `sub` (ou `id`), `email`, `role` (ou `roles[0]`).

---

## Produtos — `src/services/produtoService.js`

### product-service

| Função           | Endpoint                          | Método | Auth  | Body                     | Resposta              |
|------------------|-----------------------------------|--------|-------|--------------------------|-----------------------|
| `getProdutos`    | `/products?targetCurrency=BRL`    | GET    | Não   | —                        | `Array<Produto>`      |
| `getCategories`  | `/products?targetCurrency=BRL`    | GET    | Não   | —                        | derivado da lista     |
| `createProduto`  | `/ws/product`                     | POST   | JWT   | Produto (sem id)         | Produto criado        |
| `updateProduto`  | `/ws/product/{id}`                | PUT    | JWT   | Produto atualizado       | Produto atualizado    |
| `deleteProduto`  | `/ws/product/{id}`                | DELETE | JWT   | —                        | 204 No Content        |

### Mapeamento de campos

O frontend usa nomes em português/abreviados; o backend usa inglês:

| App (frontend)  | Backend           |
|-----------------|-------------------|
| `title`         | `name`            |
| `mentor`        | `instructor`      |
| `image`         | `imageUrl`        |
| `video`         | `videoUrl`        |
| `descricao`     | `description`     |
| `cargaHoraria`  | `workload`        |
| `modulos`       | `modules`         |

> `imageUrl` e `videoUrl` devem ser URLs públicas (Cloudinary, Supabase
> Storage, etc.). O upload para o serviço de storage é feito pelo backend
> ou pelo colega responsável por essa integração.

---

## Pedidos — `src/services/orderService.js`

### order-service

| Função        | Endpoint           | Método | Auth | Body                              | Resposta              |
|---------------|--------------------|--------|------|-----------------------------------|-----------------------|
| `getOrders`   | `/ws/orders/BRL`   | GET    | JWT  | —                                 | `Array<Order>`        |
| `createOrder` | `/ws/orders`       | POST   | JWT  | `{ items, paymentMethod, total }` | Order criado          |

### Mapeamento de campos (resposta do backend)

| App (frontend)  | Backend (possíveis variações) |
|-----------------|-------------------------------|
| `id`            | `id` ou `orderId`             |
| `date`          | `date` ou `createdAt`         |
| `items`         | `items` ou `products`         |
| `paymentMethod` | `paymentMethod` ou `payment`  |
| `total`         | `total` ou `totalAmount`      |

---

## Rotas protegidas (JWT)

O gateway-service bloqueia todas as rotas `/ws/**` e exige token válido.
O `httpClient` (`src/services/httpClient.js`) já envia automaticamente o
header `Authorization: Bearer <token>` em todas as chamadas com
`requireAuth: true` (padrão).

Rotas **públicas** (sem JWT):
- `POST /auth/signin`
- `POST /auth/signup`
- `GET /products?targetCurrency=BRL`

---

## Tratamento de erros

O `httpClient` espera que erros do backend venham no formato:
```json
{ "message": "descrição do erro" }
```
Se o backend usar outro formato (`{ "error": "..." }` ou `{ "errors": [...] }`),
ajustar a função `extractErrorMessage` em `src/services/httpClient.js`.

O status `401` limpa o storage e força novo login automaticamente.

---

## Executando o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Subir o backend (docker-compose do repositório do backend)
docker-compose up

# 3. Iniciar o app
npx expo start

# Android Emulator: pressione 'a' no terminal
# iOS Simulator:    pressione 'i' no terminal
# Expo Go (device): escanear o QR code
```

> Para iOS Simulator ou Expo Go em device físico, trocar `10.0.2.2` por
> `localhost` (simulador) ou pelo IP da máquina na rede local (device físico)
> em `src/services/config.js`.
