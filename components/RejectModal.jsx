"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function RejectModal({ open, onCancel, onConfirm }) {
  const toast = useToast();
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) setMotivo("");
  }, [open]);

  if (!open) return null;

  function confirmar() {
    const m = motivo.trim();
    if (!m) { toast("Informe o motivo.", "err"); return; }
    onConfirm(m);
  }

  return (
    <div className="pc-modalbg">
      <div className="pc-modal" style={{ maxWidth: 460 }}>
        <h2>Rejeitar prestação</h2>
        <div className="pc-field">
          <label>Motivo da rejeição *</label>
          <textarea rows={3} style={{ resize: "vertical" }} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>
        <div className="pc-macts">
          <button className="pc-btn pc-btn-o" onClick={onCancel}>Cancelar</button>
          <button className="pc-btn pc-btn-d" onClick={confirmar}>Rejeitar</button>
        </div>
      </div>
    </div>
  );
}
