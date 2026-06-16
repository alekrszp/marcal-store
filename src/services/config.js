// Configuração central de integração com backend/API.
//
// USE_MOCK = true  -> app funciona 100% local (sem backend, sem banco de dados),
//                      usando os dados de src/data/* e AsyncStorage para sessão.
// USE_MOCK = false -> todas as chamadas passam a usar httpClient (services/httpClient.js)
//                      contra API_URL.
//
// PARA INTEGRAR COM BACKEND REAL:
// 1. Trocar USE_MOCK para false
// 2. Apontar API_URL para o servidor (ex: https://api.marcalstore.com.br)
// 3. Garantir HTTPS em produção (nunca usar http:// fora de ambiente local de desenvolvimento)
// 4. Conferir os comentários "INTEGRAÇÃO:" em cada service (userService, produtoService)
//    para os contratos (rotas, headers, formato de request/response) esperados pelo app
// USE_MOCK = false → integração real com o gateway-service (docker-compose local)
// USE_MOCK = true  → dados locais (sem backend rodando)
export const USE_MOCK = false;

// URL do gateway-service (Spring Cloud Gateway).
// Android Emulator acessa o host do PC via 10.0.2.2.
// iOS Simulator / Expo Web: trocar para http://localhost:8765
export const API_URL = 'http://10.0.2.2:8765';
