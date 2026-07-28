"use client";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

const API = "/api/relatorios";

async function chamarApi(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Erro ao comunicar com o servidor.");
  return data;
}

/* Store dos relatórios de Prestação de Contas: os dados moram no
   Supabase (via rotas de API do Next.js). Este hook busca a lista ao
   montar, recarrega após cada mutação, e também ao voltar o foco pra
   aba — assim quem está com a tela aberta vê o que outra pessoa fez. */
export function useReportsStore() {
  const toast = useToast();
  const [relatorios, setRelatorios] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar.");
      setRelatorios(data.relatorios || []);
    } catch (e) {
      toast("Não foi possível carregar os dados do servidor.", "err");
    } finally {
      setHydrated(true);
    }
  }, [toast]);

  useEffect(() => { recarregar(); }, [recarregar]);

  useEffect(() => {
    function onFocus() { recarregar(); }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [recarregar]);

  const salvar = useCallback(async ({ relExistente, funcionarioId, funcionarioNome, projeto, periodoIni, periodoFim, itens, submeter }) => {
    const rel = await chamarApi(API, {
      id: relExistente?.id ?? null,
      funcionarioId, funcionarioNome, projeto, periodoIni, periodoFim, itens, submeter,
    });
    await recarregar();
    return rel;
  }, [recarregar]);

  const mudarStatus = useCallback(async (relId, action, motivo) => {
    const rel = await chamarApi(API + "/" + relId + "/status", { action, motivo });
    await recarregar();
    return rel;
  }, [recarregar]);

  const aprovar = useCallback((relId) => mudarStatus(relId, "aprovar"), [mudarStatus]);
  const pagar = useCallback((relId) => mudarStatus(relId, "pagar"), [mudarStatus]);
  const rejeitar = useCallback((relId, motivo) => mudarStatus(relId, "rejeitar", motivo), [mudarStatus]);

  const aprovarLote = useCallback(async (ids) => {
    const { count } = await chamarApi(API + "/aprovar-lote", { ids });
    await recarregar();
    return count;
  }, [recarregar]);

  const rejeitarLote = useCallback(async (ids, motivo) => {
    const { count } = await chamarApi(API + "/rejeitar-lote", { ids, motivo });
    await recarregar();
    return count;
  }, [recarregar]);

  const importarDB = useCallback(async (novoDb) => {
    await chamarApi(API + "/importar", { relatorios: novoDb.relatorios || [] });
    await recarregar();
  }, [recarregar]);

  return { db: { relatorios }, hydrated, salvar, aprovar, pagar, rejeitar, aprovarLote, rejeitarLote, importarDB };
}
