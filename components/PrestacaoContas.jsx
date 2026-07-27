"use client";
import { useState } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { useReportsStore } from "@/hooks/useReportsStore";
import ReportsList from "./ReportsList";
import ReportForm from "./ReportForm";

export default function PrestacaoContas() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PrestacaoContasInner />
      </AuthProvider>
    </ToastProvider>
  );
}

function PrestacaoContasInner() {
  const store = useReportsStore();
  const [view, setView] = useState("lista");
  const [atual, setAtual] = useState(null);

  function abrirForm(rel) {
    setAtual(rel);
    setView("form");
  }
  function voltar() {
    setView("lista");
  }

  return (
    <div className="panel" id="panel-prestacao">
      <div className="pc-scroll">
        <div className="pc-miolo">
          {view === "lista" ? (
            <ReportsList store={store} abrirForm={abrirForm} />
          ) : (
            <ReportForm store={store} relInicial={atual} voltar={voltar} />
          )}
        </div>
      </div>
    </div>
  );
}
