"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadSession, saveSession, clearSession } from "@/lib/storage";
import { resolveOperador, findUserByEmail } from "@/lib/auth";
import { PC_DOMINIO } from "@/lib/data";
import { useToast } from "./ToastContext";
import LoginModal from "@/components/LoginModal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const toast = useToast();
  const [operador, setOperador] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setOperador(resolveOperador(loadSession()));
  }, []);

  const abrirLogin = useCallback(() => {
    setErro("");
    setModalOpen(true);
  }, []);

  const fecharLogin = useCallback(() => setModalOpen(false), []);

  const confirmarLogin = useCallback((email) => {
    const u = findUserByEmail(email);
    if (!u) {
      setErro("E-mail não reconhecido. Use seu e-mail corporativo Valon.");
      return;
    }
    const session = { nome: u.nome, email: u.id + PC_DOMINIO, cargo: u.cargo };
    saveSession(session);
    setOperador(resolveOperador(session));
    setModalOpen(false);
  }, []);

  const sair = useCallback(() => {
    clearSession();
    setOperador(null);
  }, []);

  const exigeOperador = useCallback(() => {
    if (!operador) {
      toast("Faça login para continuar.", "err");
      abrirLogin();
      return null;
    }
    return operador;
  }, [operador, toast, abrirLogin]);

  return (
    <AuthContext.Provider value={{ operador, abrirLogin, sair, exigeOperador }}>
      {children}
      <LoginModal open={modalOpen} error={erro} onClose={fecharLogin} onSubmit={confirmarLogin} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
