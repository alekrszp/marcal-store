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
export const USE_MOCK = true;
export const API_URL  = 'https://api.marcalstore.com.br';
