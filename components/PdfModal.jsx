"use client";
import { useState } from "react";
import { PC_CONTAS } from "@/lib/data";
import { gerarPDF } from "@/lib/pdf";
import { useToast } from "@/context/ToastContext";

export default function PdfModal({ open, onCancel, dados }) {
  const toast = useToast();
  const [contaIdx, setContaIdx] = useState(0);

  if (!open) return null;

  async function gerar() {
    onCancel();
    try {
      toast("Gerando PDF…");
      await gerarPDF({ ...dados, contaIndex: contaIdx });
      toast("PDF gerado!", "ok");
    } catch (err) {
      console.error(err);
      toast("Erro ao gerar PDF: " + (err.message || err), "err");
    }
  }

  return (
    <div className="pc-modalbg">
      <div className="pc-modal" style={{ maxWidth: 460 }}>
        <h2>Gerar PDF Consolidado</h2>
        <div className="pc-field">
          <label>Conta de recebimento (nota de débito)</label>
          <select value={contaIdx} onChange={(e) => setContaIdx(+e.target.value)}>
            {PC_CONTAS.map((c, i) => (
              <option key={i} value={i}>{c.n}</option>
            ))}
          </select>
        </div>
        <div className="pc-macts">
          <button className="pc-btn pc-btn-o" onClick={onCancel}>Cancelar</button>
          <button className="pc-btn pc-btn-g" onClick={gerar}>Gerar e Baixar</button>
        </div>
      </div>
    </div>
  );
}
