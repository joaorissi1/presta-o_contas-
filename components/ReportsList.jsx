"use client";
import { useMemo, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { PC_USERS } from "@/lib/data";
import { brl, dBR, norm, hojeISO } from "@/lib/format";
import { totalRel } from "@/lib/report";
import RejectModal from "./RejectModal";

export default function ReportsList({ store, abrirForm }) {
  const toast = useToast();
  const importRef = useRef(null);

  const [status, setStatus] = useState("");
  const [func, setFunc] = useState("");
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState(new Set());
  const [rejModalOpen, setRejModalOpen] = useState(false);

  const ano = String(new Date().getFullYear());
  const rels = store.db.relatorios;
  const rasc = rels.filter((r) => r.status === "rascunho").length;
  const subm = rels.filter((r) => r.status === "submetido").length;
  const aprov = rels.filter((r) => r.status === "aprovado").length;
  const totalAno = brl(rels.filter((r) => (r.periodoIni || "").startsWith(ano)).reduce((s, r) => s + totalRel(r), 0));

  const filtrados = useMemo(() => {
    const fq = norm(busca);
    return rels
      .filter((r) => {
        if (status && r.status !== status) return false;
        if (func && r.funcionarioId !== func) return false;
        if (fq && !norm(r.codigo + " " + r.projeto + " " + r.funcionarioNome).includes(fq)) return false;
        return true;
      })
      .sort((a, b) => b.id - a.id);
  }, [rels, status, func, busca]);

  const selecionaveisVisiveis = useMemo(() => filtrados.filter((r) => r.status === "submetido").map((r) => r.id), [filtrados]);
  const todosSelecionados = selecionaveisVisiveis.length > 0 && selecionaveisVisiveis.every((id) => selecionados.has(id));

  function toggleSelAll(checked) {
    setSelecionados(checked ? new Set(selecionaveisVisiveis) : new Set());
  }
  function toggleSel(id, checked) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }
  async function aprovarSelecionados() {
    const ids = [...selecionados]; if (!ids.length) return;
    if (!confirm("Aprovar " + ids.length + " prestação(ões) selecionada(s)?")) return;
    try {
      const n = await store.aprovarLote(ids);
      toast(n + " prestação(ões) aprovada(s).", "ok");
      setSelecionados(new Set());
    } catch (e) {
      toast(e.message || "Erro ao aprovar em lote.", "err");
    }
  }
  async function recusarSelecionadosConfirmado(motivo) {
    const ids = [...selecionados]; if (!ids.length) return;
    try {
      const n = await store.rejeitarLote(ids, motivo);
      toast(n + " prestação(ões) recusada(s).", "ok");
      setSelecionados(new Set());
      setRejModalOpen(false);
    } catch (e) {
      toast(e.message || "Erro ao recusar em lote.", "err");
    }
  }

  function exportar() {
    const blob = new Blob([JSON.stringify(store.db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "valon-prestacao-backup-" + hojeISO() + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 800);
    toast("Backup exportado.", "ok");
  }

  function onImportFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = async () => {
      try {
        const d = JSON.parse(rd.result);
        if (!d || !Array.isArray(d.relatorios)) throw new Error("Arquivo inválido.");
        if (!confirm("Importar " + d.relatorios.length + " relatórios? Os dados atuais serão substituídos.")) return;
        await store.importarDB(d);
        toast("Backup importado.", "ok");
      } catch (err) {
        toast(err.message || "Arquivo inválido.", "err");
      }
    };
    rd.readAsText(f);
    e.target.value = "";
  }

  return (
    <div className="pc-view" id="pc-view-lista">
      <div className="pc-bar">
        <div>
          <div className="pc-title">Prestação de Contas</div>
          <div className="pc-sub">Reembolsos · Notas de débito · Fluxo de aprovação</div>
        </div>
        <div className="pc-acts">
          <button className="pc-btn pc-btn-o" onClick={exportar}>⬇ Exportar</button>
          <button className="pc-btn pc-btn-o" onClick={() => importRef.current?.click()}>⬆ Importar</button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={onImportFile} />
          <button className="pc-btn pc-btn-g" onClick={() => abrirForm(null)}>+ Nova Prestação</button>
        </div>
      </div>

      <div className="pc-kpis">
        <div className="pc-kpi"><div className="pc-kl">Rascunhos</div><div className="pc-kv">{rasc}</div><div className="pc-kh">Aguardando submissão</div></div>
        <div className="pc-kpi"><div className="pc-kl">Submetidos</div><div className="pc-kv">{subm}</div><div className="pc-kh">Aguardando aprovação</div></div>
        <div className="pc-kpi"><div className="pc-kl">Aprovados</div><div className="pc-kv">{aprov}</div><div className="pc-kh">A pagar</div></div>
        <div className="pc-kpi"><div className="pc-kl">Total no ano</div><div className="pc-kv">{totalAno}</div><div className="pc-kh">Acumulado {ano}</div></div>
      </div>

      <div className="pc-widget">
        <div className="pc-whead">
          <span>Relatórios</span>
          {selecionaveisVisiveis.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pc-btn pc-btn-d pc-btn-min" disabled={selecionados.size === 0} onClick={() => setRejModalOpen(true)}>
                Recusar Selecionados ({selecionados.size})
              </button>
              <button className="pc-btn pc-btn-v pc-btn-min" disabled={selecionados.size === 0} onClick={aprovarSelecionados}>
                Aprovar Selecionados ({selecionados.size})
              </button>
            </div>
          )}
        </div>
        <div className="pc-filtros">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="submetido">Submetido</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="pago">Pago</option>
          </select>
          <select value={func} onChange={(e) => setFunc(e.target.value)}>
            <option value="">Todos os funcionários</option>
            {PC_USERS.map((u) => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </select>
          <input style={{ flex: 1, minWidth: 180 }} placeholder="Buscar por projeto, código..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="pc-tb">
            <thead>
              <tr>
                <th style={{ width: 26 }}>
                  {selecionaveisVisiveis.length > 0 && (
                    <input type="checkbox" checked={todosSelecionados} onChange={(e) => toggleSelAll(e.target.checked)} />
                  )}
                </th>
                <th>Código</th><th>Funcionário</th><th>Projeto</th><th>Período</th><th>Total</th><th>Status</th><th>Aprovação</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--ink-4)", padding: 26 }}>Nenhum relatório encontrado</td></tr>
              ) : (
                filtrados.map((r) => (
                  <tr key={r.id} className="pc-click" onClick={() => abrirForm(r)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      {r.status === "submetido" && (
                        <input type="checkbox" checked={selecionados.has(r.id)} onChange={(e) => toggleSel(r.id, e.target.checked)} />
                      )}
                    </td>
                    <td className="pc-codigo">{r.codigo}</td>
                    <td>{r.funcionarioNome}</td>
                    <td>{r.projeto || "—"}</td>
                    <td>{dBR(r.periodoIni)} a {dBR(r.periodoFim)}</td>
                    <td className="pc-codigo">{brl(totalRel(r))}</td>
                    <td><span className={"pc-tag pc-tag-" + r.status}>{r.status}</span></td>
                    <td style={{ textAlign: "center" }}>
                      {["aprovado", "pago"].includes(r.status)
                        ? <span className="pc-flag-ok" title="Aprovado">✓</span>
                        : <span className="pc-flag-no">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RejectModal
        open={rejModalOpen}
        count={selecionados.size}
        onCancel={() => setRejModalOpen(false)}
        onConfirm={recusarSelecionadosConfirmado}
      />
    </div>
  );
}
