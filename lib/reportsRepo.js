import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { pushHist } from "./report";

const TABLE = "relatorios";

function mapRow(row) {
  return {
    id: row.id,
    codigo: row.codigo,
    funcionarioId: row.funcionario_id,
    funcionarioNome: row.funcionario_nome,
    projeto: row.projeto,
    periodoIni: row.periodo_ini,
    periodoFim: row.periodo_fim,
    status: row.status,
    motivoRejeicao: row.motivo_rejeicao || "",
    itens: row.itens || [],
    historico: row.historico || [],
  };
}

export async function listarRelatorios() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from(TABLE).select("*").order("id", { ascending: false });
  if (error) throw error;
  return data.map(mapRow);
}

async function proximoCodigo() {
  const supabaseAdmin = getSupabaseAdmin();
  const ano = new Date().getFullYear();
  const chave = "PC-" + ano;
  const { data: seq, error } = await supabaseAdmin.rpc("proximo_contador", { p_chave: chave });
  if (error) throw error;
  return chave + "-" + String(seq).padStart(4, "0");
}

export async function salvarRelatorio({ id, funcionarioId, funcionarioNome, projeto, periodoIni, periodoFim, itens, submeter }) {
  const supabaseAdmin = getSupabaseAdmin();
  if (id) {
    const { data: existente, error: e1 } = await supabaseAdmin.from(TABLE).select("*").eq("id", id).single();
    if (e1) throw e1;
    const rel = { historico: existente.historico || [] };
    pushHist(rel, "Editou");
    if (submeter) pushHist(rel, "Submeteu");
    const patch = {
      funcionario_id: funcionarioId,
      funcionario_nome: funcionarioNome,
      projeto, periodo_ini: periodoIni, periodo_fim: periodoFim,
      itens,
      historico: rel.historico,
    };
    if (submeter) {
      patch.status = "submetido";
      patch.motivo_rejeicao = "";
    }
    const { data, error } = await supabaseAdmin.from(TABLE).update(patch).eq("id", id).select().single();
    if (error) throw error;
    return mapRow(data);
  }

  const codigo = await proximoCodigo();
  const rel = { historico: [] };
  pushHist(rel, "Criou");
  if (submeter) pushHist(rel, "Submeteu");
  const insertRow = {
    codigo,
    funcionario_id: funcionarioId,
    funcionario_nome: funcionarioNome,
    projeto, periodo_ini: periodoIni, periodo_fim: periodoFim,
    status: submeter ? "submetido" : "rascunho",
    itens,
    historico: rel.historico,
  };
  const { data, error } = await supabaseAdmin.from(TABLE).insert(insertRow).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function mudarStatus(id, action, motivo) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: existente, error: e1 } = await supabaseAdmin.from(TABLE).select("*").eq("id", id).single();
  if (e1) throw e1;
  const mapa = { aprovar: ["aprovado", "Aprovou"], pagar: ["pago", "Marcou Pago"], rejeitar: ["rejeitado", "Rejeitou"] };
  const [novoStatus, acao] = mapa[action] || [];
  if (!novoStatus) throw new Error("Ação inválida: " + action);
  const rel = { historico: existente.historico || [] };
  pushHist(rel, acao, motivo);
  const patch = { status: novoStatus, historico: rel.historico };
  if (novoStatus === "rejeitado") patch.motivo_rejeicao = motivo || "";
  const { data, error } = await supabaseAdmin.from(TABLE).update(patch).eq("id", id).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function mudarStatusLote(ids, action, motivo) {
  const supabaseAdmin = getSupabaseAdmin();
  const mapa = { aprovar: ["aprovado", "Aprovou"], rejeitar: ["rejeitado", "Rejeitou"] };
  const [novoStatus, acao] = mapa[action] || [];
  if (!novoStatus) throw new Error("Ação inválida: " + action);
  const { data: candidatos, error: e1 } = await supabaseAdmin.from(TABLE).select("*").in("id", ids).eq("status", "submetido");
  if (e1) throw e1;
  let count = 0;
  for (const row of candidatos) {
    const rel = { historico: row.historico || [] };
    pushHist(rel, acao, motivo);
    const patch = { status: novoStatus, historico: rel.historico };
    if (novoStatus === "rejeitado") patch.motivo_rejeicao = motivo || "";
    const { error } = await supabaseAdmin.from(TABLE).update(patch).eq("id", row.id);
    if (error) throw error;
    count++;
  }
  return count;
}

export async function importarRelatorios(lista) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error: delError } = await supabaseAdmin.from(TABLE).delete().neq("id", 0);
  if (delError) throw delError;
  if (!lista.length) return;
  const rows = lista.map((r) => ({
    codigo: r.codigo,
    funcionario_id: r.funcionarioId,
    funcionario_nome: r.funcionarioNome,
    projeto: r.projeto,
    periodo_ini: r.periodoIni,
    periodo_fim: r.periodoFim,
    status: r.status,
    motivo_rejeicao: r.motivoRejeicao || "",
    itens: r.itens || [],
    historico: r.historico || [],
  }));
  const { error } = await supabaseAdmin.from(TABLE).insert(rows);
  if (error) throw error;
}
