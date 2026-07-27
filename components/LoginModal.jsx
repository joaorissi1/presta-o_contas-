"use client";
import { useEffect, useState } from "react";

export default function LoginModal({ open, error, onClose, onSubmit }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) setEmail("");
  }, [open]);

  if (!open) return null;

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(email);
    }
  }

  return (
    <div className="pc-modalbg">
      <div className="pc-modal" style={{ maxWidth: 400 }}>
        <h2>Entrar</h2>
        <div className="pc-field">
          <label>E-mail corporativo *</label>
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="nome.sobrenome@valonconsult.com.br"
          />
        </div>
        {error && (
          <div style={{ color: "var(--wine)", fontSize: 12, marginTop: 6 }}>{error}</div>
        )}
        <div className="pc-macts">
          <button className="pc-btn pc-btn-o" onClick={onClose}>Cancelar</button>
          <button className="pc-btn pc-btn-g" onClick={() => onSubmit(email)}>Entrar</button>
        </div>
      </div>
    </div>
  );
}
