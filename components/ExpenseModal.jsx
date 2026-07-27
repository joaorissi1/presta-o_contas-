"use client";
import { useEffect, useRef, useState } from "react";
import { PC_CATS, PC_LIM } from "@/lib/data";
import { brl, hojeISO } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

export default function ExpenseModal({ open, itemInicial, onCancel, onSave }) {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [data, setData] = useState("");
  const [tipo, setTipo] = useState("");
  const [prof, setProf] = useState(1);
  const [km, setKm] = useState("");
  const [preco, setPreco] = useState(PC_LIM.km);
  const [coment, setComent] = useState("");
  const [valor, setValor] = useState("");
  const [destino, setDestino] = useState("Funcionario");
  const [anexo, setAnexo] = useState(null);

  useEffect(() => {
    if (!open) return;
    setData(itemInicial?.data || hojeISO());
    setTipo(itemInicial?.tipo || "");
    setProf(itemInicial?.prof || 1);
    setKm(itemInicial?.km || "");
    setPreco(itemInicial?.precoUnitario || PC_LIM.km);
    setComent(itemInicial?.comentario || "");
    setValor(itemInicial?.valor || "");
    setDestino(itemInicial?.destino || "Funcionario");
    setAnexo(itemInicial?.anexoData ? { nome: itemInicial.anexoNome, data: itemInicial.anexoData } : null);
  }, [open, itemInicial]);

  if (!open) return null;

  const isKm = tipo === "Quilometragem";
  const limiteTexto =
    tipo === "Almoço" ? brl(PC_LIM.almoco) + " / pessoa"
    : tipo === "Jantar" ? brl(PC_LIM.jantar) + " / pessoa"
    : isKm ? brl(PC_LIM.km) + " / km"
    : "";
  const estouro =
    (tipo === "Almoço" && (+valor || 0) > PC_LIM.almoco * (+prof || 1)) ||
    (tipo === "Jantar" && (+valor || 0) > PC_LIM.jantar * (+prof || 1));

  function handleTipoChange(novoTipo) {
    setTipo(novoTipo);
    const cat = PC_CATS.find((c) => c[0] === novoTipo);
    if (cat && cat[1]) setDestino(cat[1]);
  }

  function recalcKm(novoKm, novoPreco) {
    const k = +novoKm || 0, p = +novoPreco || PC_LIM.km;
    if (tipo === "Quilometragem" && k > 0) setValor((k * p).toFixed(2));
  }

  function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 400 * 1024) {
      setAnexo({ nome: f.name, data: null });
      return;
    }
    const rd = new FileReader();
    rd.onload = () => setAnexo({ nome: f.name, data: rd.result });
    rd.readAsDataURL(f);
  }

  function handleSave() {
    if (!data || !tipo || !(+valor > 0)) { toast("Preencha data, tipo e valor.", "err"); return; }
    onSave({
      id: itemInicial?.id || Date.now(),
      data, tipo,
      prof: +prof || 1,
      km: +km || null,
      precoUnitario: tipo === "Quilometragem" ? (+preco || PC_LIM.km) : null,
      comentario: coment.trim(),
      valor: +valor,
      destino,
      anexoNome: anexo?.nome || null,
      anexoData: anexo?.data || null,
    });
  }

  return (
    <div className="pc-modalbg">
      <div className="pc-modal">
        <h2>{itemInicial ? "Editar Despesa" : "Nova Despesa"}</h2>
        <div className="pc-grid">
          <div className="pc-field">
            <label>Data da despesa *</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="pc-field">
            <label>Tipo *</label>
            <select value={tipo} onChange={(e) => handleTipoChange(e.target.value)}>
              <option value="">— Selecione —</option>
              {PC_CATS.map((c) => (
                <option key={c[0]} value={c[0]}>{c[0]}</option>
              ))}
            </select>
          </div>
          <div className="pc-field">
            <label>Profissionais</label>
            <input type="number" min={1} value={prof} onChange={(e) => setProf(e.target.value)} />
          </div>
          {isKm && (
            <div className="pc-field">
              <label>Quilômetros</label>
              <input type="number" step={1} min={0} value={km} onChange={(e) => { setKm(e.target.value); recalcKm(e.target.value, preco); }} />
            </div>
          )}
          {isKm && (
            <div className="pc-field">
              <label>Preço Unitário (R$/km)</label>
              <input type="number" step={0.01} min={0} value={preco} onChange={(e) => { setPreco(e.target.value); recalcKm(km, e.target.value); }} />
            </div>
          )}
          <div className="pc-field pc-full">
            <label>Comentário / Descrição</label>
            <input value={coment} onChange={(e) => setComent(e.target.value)} placeholder="Ex.: Almoço com cliente · 3 profissionais" />
          </div>
          <div className="pc-field">
            <label>Valor (R$) *</label>
            <input type="number" step={0.01} min={0} value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
          <div className="pc-field">
            <label>Destino do reembolso *</label>
            <select value={destino} onChange={(e) => setDestino(e.target.value)}>
              <option value="Funcionario">Funcionário</option>
              <option value="Empresa">Empresa</option>
            </select>
          </div>
          <div className="pc-field">
            <label>Limite aplicável</label>
            <input readOnly value={limiteTexto} />
            {estouro && <div className="pc-estouro">⚠ Valor acima do limite do projeto</div>}
          </div>
          <div className="pc-field pc-full">
            <label>Comprovante (imagem ou PDF · até 400 KB)</label>
            <div className="pc-drop" onClick={() => fileInputRef.current?.click()}>
              📎 Arraste o comprovante aqui ou clique para selecionar
              <input ref={fileInputRef} type="file" hidden accept="image/*,application/pdf" onChange={handleFile} />
            </div>
            {anexo && (
              <div>
                <span className="pc-anexo">
                  📎 {anexo.nome}{anexo.data === null ? " · ⚠ acima de 400 KB — registrado só o nome" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="pc-macts">
          <button className="pc-btn pc-btn-o" onClick={onCancel}>Cancelar</button>
          <button className="pc-btn pc-btn-g" onClick={handleSave}>Salvar Despesa</button>
        </div>
      </div>
    </div>
  );
}
