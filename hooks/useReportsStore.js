"use client";
import { useCallback, useEffect, useState } from "react";
import { loadDB, saveDB } from "@/lib/storage";
import { pushHist } from "@/lib/auth";
import { useToast } from "@/context/ToastContext";

/* Store dos relatórios de Prestação de Contas: mantém `db` em estado
   React e persiste no localStorage a cada alteração. Todas as
   mutações são imutáveis (map/filter/spread), nunca tocam o objeto
   de estado anterior diretamente. */
export function useReportsStore() {
  const toast = useToast();
  const [db, setDb] = useState({ seq: 0, relatorios: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDb(loadDB());
    setHydrated(true);
  }, []);

  const commit = useCallback((next) => {
    try {
      saveDB(next);
    } catch (e) {
      toast("Armazenamento cheio — exporte um backup e remova anexos grandes.", "err");
    }
    setDb(next);
  }, [toast]);

  const salvar = useCallback(({ relExistente, funcionarioId, funcionarioNome, projeto, periodoIni, periodoFim, itens, submeter, operadorNome }) => {
    let seq = db.seq;
    let rel;
    let relatorios;
    if (relExistente) {
      rel = { ...relExistente, historico: [...(relExistente.historico || [])] };
      relatorios = db.relatorios.map((r) => (r.id === rel.id ? rel : r));
    } else {
      seq = db.seq + 1;
      rel = {
        id: Date.now(),
        codigo: "PC-" + new Date().getFullYear() + "-" + String(seq).padStart(4, "0"),
        status: "rascunho",
        historico: [],
      };
      pushHist(rel, "Criou", "", operadorNome);
      relatorios = [...db.relatorios, rel];
    }
    Object.assign(rel, {
      funcionarioId, funcionarioNome, lancadoPor: operadorNome,
      projeto, periodoIni, periodoFim,
      itens: JSON.parse(JSON.stringify(itens)),
    });
    if (submeter) {
      rel.status = "submetido"; rel.motivoRejeicao = "";
      pushHist(rel, "Submeteu", "", operadorNome);
    } else if (relExistente) {
      pushHist(rel, "Editou", "", operadorNome);
    }
    commit({ seq, relatorios });
    return rel;
  }, [db, commit]);

  const mudarStatus = useCallback((relId, novoStatus, acao, obs, operadorNome) => {
    let relAtualizado = null;
    const relatorios = db.relatorios.map((r) => {
      if (r.id !== relId) return r;
      const copia = { ...r, historico: [...(r.historico || [])] };
      copia.status = novoStatus;
      if (novoStatus === "rejeitado") copia.motivoRejeicao = obs;
      pushHist(copia, acao, obs, operadorNome);
      relAtualizado = copia;
      return copia;
    });
    commit({ seq: db.seq, relatorios });
    return relAtualizado;
  }, [db, commit]);

  const aprovar = useCallback((relId, operadorNome) => mudarStatus(relId, "aprovado", "Aprovou", "", operadorNome), [mudarStatus]);
  const pagar = useCallback((relId, operadorNome) => mudarStatus(relId, "pago", "Marcou Pago", "", operadorNome), [mudarStatus]);
  const rejeitar = useCallback((relId, motivo, operadorNome) => mudarStatus(relId, "rejeitado", "Rejeitou", motivo, operadorNome), [mudarStatus]);

  const aprovarLote = useCallback((ids, operadorNome) => {
    let count = 0;
    const relatorios = db.relatorios.map((r) => {
      if (!ids.includes(r.id) || r.status !== "submetido") return r;
      count++;
      const copia = { ...r, historico: [...(r.historico || [])] };
      copia.status = "aprovado";
      pushHist(copia, "Aprovou", "", operadorNome);
      return copia;
    });
    commit({ seq: db.seq, relatorios });
    return count;
  }, [db, commit]);

  const importarDB = useCallback((novoDb) => {
    commit({ seq: novoDb.seq || 0, relatorios: novoDb.relatorios });
  }, [commit]);

  return { db, hydrated, salvar, aprovar, pagar, rejeitar, aprovarLote, importarDB };
}
