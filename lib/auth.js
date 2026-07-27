/* AUTH — resolução de identidade e regras de permissão. Funções
   puras (sem estado React, sem DOM) usadas pelo AuthContext e
   pelos componentes que precisam checar quem pode o quê. */
import { PC_DOMINIO, PC_USERS, PC_APROVADORES, PC_ROLES } from "./data";
import { agora } from "./format";

export function resolveOperador(session) {
  if (!session || !session.nome) return null;
  const u = PC_USERS.find((x) => x.nome === session.nome || x.id + PC_DOMINIO === session.email);
  if (u) return { ...u, viaSessao: true };
  return { id: null, nome: session.nome, cargo: session.cargo || "CONSULTOR JUNIOR", viaSessao: true };
}

export function findUserByEmail(email) {
  const e = (email || "").trim().toLowerCase();
  return PC_USERS.find((x) => (x.id + PC_DOMINIO).toLowerCase() === e) || null;
}

export function podeAprovar(operador) {
  return !!(operador && operador.id && PC_APROVADORES.includes(operador.id));
}

export function podePagar(operador) {
  return !!(operador && (PC_ROLES[operador.cargo] || []).includes("FINANCEIRO"));
}

export function podeEditar(rel) {
  return !rel || ["rascunho", "rejeitado"].includes(rel.status);
}

export function totalRel(rel) {
  return (rel.itens || []).reduce((s, i) => s + (+i.valor || 0), 0);
}

export function pushHist(rel, acao, obs, autor) {
  (rel.historico = rel.historico || []).push({ acao, autor: autor || "—", em: agora(), obs: obs || "" });
}
