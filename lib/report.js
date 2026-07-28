/* REPORT — regras e helpers sobre um relatório de prestação de
   contas. Sem conceito de identidade/sessão: qualquer pessoa com
   acesso ao link pode editar, aprovar, rejeitar ou marcar como paga. */
import { agora } from "./format";

export function podeEditar(rel) {
  return !rel || ["rascunho", "rejeitado"].includes(rel.status);
}

export function totalRel(rel) {
  return (rel.itens || []).reduce((s, i) => s + (+i.valor || 0), 0);
}

export function pushHist(rel, acao, obs) {
  (rel.historico = rel.historico || []).push({ acao, em: agora(), obs: obs || "" });
}
