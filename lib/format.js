/* FORMAT — funções puras de formatação (sem estado, sem DOM) */

export const brl = (v) =>
  (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dBR = (s) => {
  if (!s) return "—";
  const a = s.split("-");
  return a.length === 3 ? a[2] + "/" + a[1] + "/" + a[0] : s;
};

export const hojeISO = () => new Date().toISOString().slice(0, 10);

export const agora = () => new Date().toLocaleString("pt-BR");

export const norm = (t) =>
  (t || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
