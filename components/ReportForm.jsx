"use client";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { PC_USERS, PC_PROJ } from "@/lib/data";
import { brl, dBR } from "@/lib/format";
import { podeEditar } from "@/lib/report";
import ExpenseModal from "./ExpenseModal";
import RejectModal from "./RejectModal";
import PdfModal from "./PdfModal";

export default function ReportForm({ store, relInicial, voltar }) {
  const toast = useToast();

  const readonly = !podeEditar(relInicial);
  const [funcionarioId, setFuncionarioId] = useState(relInicial ? relInicial.funcionarioId : "");
  const [projeto, setProjeto] = useState(relInicial ? relInicial.projeto : "");
  const [periodoIni, setPeriodoIni] = useState(relInicial ? relInicial.periodoIni : "");
  const [periodoFim, setPeriodoFim] = useState(relInicial ? relInicial.periodoFim : "");
  const [itens, setItens] = useState(relInicial ? JSON.parse(JSON.stringify(relInicial.itens || [])) : []);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemEditIx, setItemEditIx] = useState(null);
  const [rejModalOpen, setRejModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const podeAprovarEsta = relInicial && relInicial.status === "submetido";
  const podePagarEsta = relInicial && relInicial.status === "aprovado";
  const aprovEntry = relInicial && (relInicial.historico || []).slice().reverse().find((e) => e.acao === "Aprovou");
  const mostraBannerAprov = relInicial && ["aprovado", "pago"].includes(relInicial.status) && aprovEntry;

  function abrirItem(ix) { setItemEditIx(ix); setItemModalOpen(true); }
  function fecharItem() { setItemModalOpen(false); }
  function salvarItem(novoItem) {
    setItens((prev) => {
      const copy = [...prev];
      if (itemEditIx !== null) copy[itemEditIx] = novoItem; else copy.push(novoItem);
      return copy;
    });
    setItemModalOpen(false);
    toast("Despesa salva.", "ok");
  }
  function removerItem(ix) {
    if (!confirm("Remover esta despesa?")) return;
    setItens((prev) => prev.filter((_, i) => i !== ix));
  }

  async function handleSalvar(submeter) {
    if (!funcionarioId) return toast("Selecione o funcionário.", "err");
    if (!projeto) return toast("Selecione o projeto.", "err");
    if (!periodoIni || !periodoFim) return toast("Preencha o período.", "err");
    if (submeter && !itens.length) return toast("Adicione ao menos uma despesa antes de submeter.", "err");
    const func = PC_USERS.find((u) => u.id === funcionarioId);
    try {
      await store.salvar({
        relExistente: relInicial, funcionarioId, funcionarioNome: func.nome,
        projeto, periodoIni, periodoFim, itens, submeter,
      });
      toast(submeter ? "Prestação submetida para aprovação!" : "Rascunho salvo.", "ok");
      voltar();
    } catch (e) {
      toast(e.message || "Erro ao salvar.", "err");
    }
  }
  async function handleAprovar() {
    try {
      await store.aprovar(relInicial.id);
      toast("Prestação aprovada.", "ok");
      voltar();
    } catch (e) {
      toast(e.message || "Erro ao aprovar.", "err");
    }
  }
  async function handlePagar() {
    try {
      await store.pagar(relInicial.id);
      toast("Prestação marcada como paga.", "ok");
      voltar();
    } catch (e) {
      toast(e.message || "Erro ao marcar como paga.", "err");
    }
  }
  async function handleRejeitar(motivo) {
    try {
      await store.rejeitar(relInicial.id, motivo);
      setRejModalOpen(false);
      toast("Prestação rejeitada.", "ok");
      voltar();
    } catch (e) {
      toast(e.message || "Erro ao rejeitar.", "err");
    }
  }
  function handlePdf() {
    if (!itens.length) { toast("Sem despesas para gerar o PDF.", "err"); return; }
    setPdfModalOpen(true);
  }

  const funcionarioNome = (PC_USERS.find((u) => u.id === funcionarioId) || {}).nome || "—";
  const totalItens = itens.reduce((s, i) => s + (+i.valor || 0), 0);
  const projetosOrdenados = PC_PROJ.map((p) => p[0]).sort((a, b) => a.localeCompare(b));

  return (
    <div className="pc-view" id="pc-view-form">
      <div className="pc-bar">
        <button className="pc-btn pc-btn-o" onClick={voltar}>← Voltar</button>
        <div className="pc-acts">
          <button className="pc-btn pc-btn-o" onClick={handlePdf}>📄 PDF</button>
          {podeEditar(relInicial) && (
            <>
              <button className="pc-btn pc-btn-o" onClick={() => handleSalvar(false)}>Salvar Rascunho</button>
              <button className="pc-btn pc-btn-g" onClick={() => handleSalvar(true)}>Submeter →</button>
            </>
          )}
          {podeAprovarEsta && (
            <>
              <button className="pc-btn pc-btn-d" onClick={() => setRejModalOpen(true)}>Rejeitar</button>
              <button className="pc-btn pc-btn-v" onClick={handleAprovar}>Aprovar ✓</button>
            </>
          )}
          {podePagarEsta && (
            <button className="pc-btn pc-btn-g" onClick={handlePagar}>Marcar Pago 💰</button>
          )}
        </div>
      </div>

      {relInicial && relInicial.status === "rejeitado" && relInicial.motivoRejeicao && (
        <div className="pc-bannerrej"><b>Rejeitada:</b> {relInicial.motivoRejeicao}</div>
      )}
      {mostraBannerAprov && (
        <div className="pc-bannerok"><b>✓ Aprovada</b> em {aprovEntry.em}</div>
      )}

      <div className="pc-widget">
        <div className="pc-whead">
          <span>{relInicial ? "Prestação de Contas" : "Nova Prestação de Contas"}</span>
          <span className="pc-codigo">{relInicial ? relInicial.codigo : ""}</span>
        </div>
        <div className="pc-grid">
          <div className="pc-field">
            <label>Funcionário (dono da despesa) *</label>
            <select disabled={readonly} value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
              <option value="">— Selecione —</option>
              {PC_USERS.map((u) => (<option key={u.id} value={u.id}>{u.nome}</option>))}
            </select>
          </div>
          <div className="pc-field">
            <label>Projeto *</label>
            <select disabled={readonly} value={projeto} onChange={(e) => setProjeto(e.target.value)}>
              <option value="">— Selecione um projeto —</option>
              {projetosOrdenados.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="pc-field">
            <label>Status</label>
            <input readOnly value={(relInicial ? relInicial.status : "rascunho").toUpperCase()} />
          </div>
          <div className="pc-field">
            <label>Período (início) *</label>
            <input type="date" disabled={readonly} value={periodoIni} onChange={(e) => setPeriodoIni(e.target.value)} />
          </div>
          <div className="pc-field">
            <label>Período (fim) *</label>
            <input type="date" disabled={readonly} value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="pc-widget">
        <div className="pc-whead">
          <span>Despesas <span style={{ color: "var(--ink-4)" }}>({itens.length})</span></span>
          <span className="pc-codigo">{brl(totalItens)}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="pc-tb">
            <thead><tr><th>Data</th><th>Tipo</th><th>Comentário</th><th>Prof.</th><th>Valor</th><th>Destino</th><th>Comprov.</th><th></th></tr></thead>
            <tbody>
              {itens.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--ink-4)", padding: 16 }}>Sem despesas lançadas.</td></tr>
              ) : (
                itens.map((it, ix) => (
                  <tr key={it.id}>
                    <td>{dBR(it.data)}</td>
                    <td>{it.tipo}</td>
                    <td>{(it.comentario || "").slice(0, 44)}</td>
                    <td style={{ textAlign: "center" }}>{it.prof || 1}</td>
                    <td className="pc-codigo">{brl(it.valor)}</td>
                    <td>{it.destino === "Empresa" ? "Empresa" : "Funcionário"}</td>
                    <td>{it.anexoNome ? "📎" : "—"}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {!readonly && (
                        <>
                          <button className="pc-btn pc-btn-o pc-btn-min" onClick={() => abrirItem(ix)}>Editar</button>{" "}
                          <button className="pc-btn pc-btn-o pc-btn-min" style={{ color: "var(--wine)" }} onClick={() => removerItem(ix)}>×</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!readonly && (
          <div className="pc-addrow" onClick={() => abrirItem(null)}>+ Adicionar Despesa</div>
        )}
      </div>

      <div className="pc-widget">
        <div className="pc-whead"><span>Histórico</span></div>
        {(relInicial?.historico || []).length ? (
          <div>
            {relInicial.historico.slice().reverse().map((e, i) => (
              <div className="pc-histitem" key={i}>
                <span className="pc-histdata">{e.em}</span>
                <span><span className="pc-histacao">{e.acao}</span>{e.obs ? " — " + e.obs : ""}</span>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: "var(--ink-4)" }}>Sem eventos.</span>
        )}
      </div>

      <ExpenseModal
        open={itemModalOpen}
        itemInicial={itemEditIx !== null ? itens[itemEditIx] : null}
        onCancel={fecharItem}
        onSave={salvarItem}
      />
      <RejectModal open={rejModalOpen} onCancel={() => setRejModalOpen(false)} onConfirm={handleRejeitar} />
      <PdfModal
        open={pdfModalOpen}
        onCancel={() => setPdfModalOpen(false)}
        dados={{
          codigo: relInicial?.codigo,
          funcionarioNome,
          projeto,
          periodoIni,
          periodoFim,
          itens,
        }}
      />
    </div>
  );
}
