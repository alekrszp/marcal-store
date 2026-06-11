// Lista de e-mails com acesso à área administrativa (CRUD de produtos).
//
// MODO ATUAL: usado apenas em mock (USE_MOCK = true em config.js) — userService
// atribui role 'admin' a quem fizer login/cadastro com um desses e-mails.
//
// INTEGRAÇÃO: em produção, o campo "role" deve vir do backend (ver
// comentários em userService.js). Esta lista deixa de ser usada quando
// USE_MOCK = false.

export const ADMIN_EMAILS = ['admin@marcalstore.com.br'];

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
