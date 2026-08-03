/* PDF — geração do PDF consolidado (capa + nota de débito +
   discriminação + uma página por despesa + comprovantes anexados).
   Bibliotecas jsPDF/pdf-lib carregadas sob demanda (lazy, CDN).
   Logo servido por public/assets/logo.png (rota /assets/logo.png). */
import { brl, dBR } from "./format";
import { PC_CONTAS } from "./data";

let libsProntas = null;
function carregaLibs() {
  if (libsProntas) return libsProntas;
  const s = (u) => new Promise((ok, er) => {
    const e = document.createElement("script");
    e.src = u; e.onload = ok; e.onerror = er; document.head.appendChild(e);
  });
  libsProntas = Promise.all([
    window.jspdf ? 0 : s("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"),
    window.PDFLib ? 0 : s("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"),
  ]);
  return libsProntas;
}

let logoDataUrlPromise = null;
function carregaLogo() {
  if (logoDataUrlPromise) return logoDataUrlPromise;
  logoDataUrlPromise = fetch("/assets/logo.png")
    .then((r) => r.blob())
    .then((blob) => new Promise((resolve, reject) => {
      const rd = new FileReader();
      rd.onload = () => resolve(rd.result);
      rd.onerror = reject;
      rd.readAsDataURL(blob);
    }));
  return logoDataUrlPromise;
}

const mm = (v) => v * 2.834645669, INK = [38, 38, 38], GOLD = [238, 181, 0];

export async function gerarPDF({ codigo, funcionarioNome, projeto, periodoIni, periodoFim, itens, contaIndex }) {
  const [, PC_LOGO] = await Promise.all([carregaLibs(), carregaLogo()]);
  const conta = PC_CONTAS[+contaIndex] || PC_CONTAS[0];
  const rel = {
    codigo: codigo || "PC-PREVIEW",
    funcionario: funcionarioNome || "—",
    projeto: projeto || "—",
    periodo: dBR(periodoIni) + " a " + dBR(periodoFim),
  };
  const total = itens.reduce((s, i) => s + (+i.valor || 0), 0);
  const totEmp = itens.filter((i) => i.destino === "Empresa").reduce((s, i) => s + (+i.valor || 0), 0);
  const totFun = total - totEmp;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = mm(20);

  /* capa */
  doc.setFillColor(...GOLD); doc.rect(0, 0, W, mm(8), "F");
  doc.addImage(PC_LOGO, "PNG", W / 2 - mm(17), mm(34), mm(34), mm(34));
  doc.setTextColor(...INK); doc.setFont("helvetica", "bold");
  doc.setFontSize(26); doc.text("PRESTAÇÃO DE CONTAS", W / 2, mm(95), { align: "center" });
  doc.setDrawColor(...GOLD); doc.setLineWidth(1); doc.line(W / 2 - mm(30), mm(101), W / 2 + mm(30), mm(101));
  doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(110, 110, 110);
  doc.text(rel.codigo, W / 2, mm(110), { align: "center" });
  const bloco = (rot, val, y) => {
    doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.setFont("helvetica", "normal");
    doc.text(rot, W / 2, y, { align: "center" }); doc.setFontSize(15); doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold"); doc.text(String(val), W / 2, y + mm(6), { align: "center" });
  };
  bloco("FUNCIONÁRIO", rel.funcionario, mm(135)); bloco("PROJETO", rel.projeto, mm(155));
  bloco("PERÍODO", rel.periodo, mm(175));
  doc.setFillColor(246, 244, 240); doc.rect(mm(45), H - mm(72), W - mm(90), mm(38), "F");
  doc.setDrawColor(...GOLD); doc.rect(mm(45), H - mm(72), W - mm(90), mm(38), "S");
  doc.setFontSize(10); doc.setTextColor(140, 140, 140); doc.setFont("helvetica", "normal");
  doc.text("VALOR TOTAL", W / 2, H - mm(60), { align: "center" });
  doc.setFontSize(22); doc.setTextColor(...INK); doc.setFont("helvetica", "bold");
  doc.text(brl(total), W / 2, H - mm(47), { align: "center" });
  doc.setFontSize(8); doc.setTextColor(150, 150, 150); doc.setFont("helvetica", "normal");
  doc.text("Valon Consult · valonconsult.com.br", W / 2, H - mm(10), { align: "center" });

  /* nota de débito */
  doc.addPage();
  doc.setFillColor(...INK); doc.rect(0, 0, W, mm(15), "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  doc.text("NOTA DE DÉBITO", M, mm(10));
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text("Emissão: " + new Date().toLocaleDateString("pt-BR"), W - M, mm(10), { align: "right" });
  let y = mm(28);
  doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("PROJETO / CLIENTE", M, y); y += mm(6);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(rel.projeto, M, y); y += mm(5); doc.text("Período: " + rel.periodo, M, y); y += mm(5);
  doc.text("Funcionário: " + rel.funcionario, M, y); y += mm(9);
  doc.setDrawColor(...GOLD); doc.line(M, y, W - M, y); y += mm(7);
  ["Pela presente Nota de Débito, solicitamos o reembolso das despesas",
    "realizadas em prol do projeto/cliente acima identificado, conforme",
    "detalhamento e comprovantes anexos neste documento consolidado.", "",
    "O valor abaixo deverá ser depositado na conta indicada ao final desta nota."
  ].forEach((l) => { doc.text(l, M, y); y += mm(5); });
  y += mm(4);
  doc.setFillColor(...GOLD); doc.rect(M, y, W - 2 * M, mm(18), "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...INK);
  doc.text("VALOR TOTAL", M + mm(5), y + mm(7));
  doc.setFontSize(18); doc.text(brl(total), W - M - mm(5), y + mm(12), { align: "right" });
  y += mm(28);
  doc.setFontSize(11); doc.text("DADOS BANCÁRIOS PARA DEPÓSITO", M, y); y += mm(7);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  [["Favorecido", conta.n], ["CNPJ", conta.cnpj], ["Banco", conta.banco],
    ["Agência", conta.ag || "—"], ["Conta", conta.cc || "—"], ["PIX", conta.pix || "—"]].forEach((kv) => {
      doc.setFont("helvetica", "bold"); doc.text(kv[0] + ":", M, y);
      doc.setFont("helvetica", "normal"); doc.text(String(kv[1]), M + mm(30), y); y += mm(6);
    });

  /* discriminação */
  doc.addPage();
  doc.setFillColor(...INK); doc.rect(0, 0, W, mm(15), "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  doc.text("DISCRIMINAÇÃO DE REEMBOLSO", M, mm(10));
  y = mm(25);
  doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(rel.funcionario + " · " + rel.periodo, M, y); y += mm(9);
  doc.setFillColor(...GOLD); doc.rect(M, y, W - 2 * M, mm(8), "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text("#", M + mm(2), y + mm(5.5)); doc.text("Data", M + mm(12), y + mm(5.5));
  doc.text("Tipo", M + mm(36), y + mm(5.5)); doc.text("Descrição", M + mm(72), y + mm(5.5));
  doc.text("Destino", M + mm(128), y + mm(5.5)); doc.text("Valor", W - M - mm(2), y + mm(5.5), { align: "right" });
  y += mm(8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  itens.forEach((it, i) => {
    if (i % 2 === 1) { doc.setFillColor(248, 247, 244); doc.rect(M, y, W - 2 * M, mm(7), "F"); }
    doc.setTextColor(...INK);
    doc.text(String(i + 1), M + mm(2), y + mm(5)); doc.text(dBR(it.data), M + mm(12), y + mm(5));
    doc.text(it.tipo, M + mm(36), y + mm(5)); doc.text((it.comentario || "").slice(0, 34), M + mm(72), y + mm(5));
    doc.text(it.destino === "Empresa" ? "Empresa" : "Funcionário", M + mm(128), y + mm(5));
    doc.text(brl(it.valor), W - M - mm(2), y + mm(5), { align: "right" });
    y += mm(7); if (y > H - mm(75)) { doc.addPage(); y = mm(25); }
  });
  y += mm(8);
  doc.setFillColor(246, 244, 240); doc.rect(M, y, W - 2 * M, mm(42), "F");
  doc.setDrawColor(...GOLD); doc.rect(M, y, W - 2 * M, mm(42), "S");
  let ly = y + mm(10);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("RESUMO FINANCEIRO", M + mm(5), ly); ly += mm(9);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Reembolso à Empresa:", M + mm(5), ly); doc.text(brl(totEmp), W - M - mm(5), ly, { align: "right" }); ly += mm(7);
  doc.text("Reembolso ao Funcionário:", M + mm(5), ly); doc.text(brl(totFun), W - M - mm(5), ly, { align: "right" }); ly += mm(9);
  doc.setDrawColor(...INK); doc.line(M + mm(5), ly - mm(3), W - M - mm(5), ly - mm(3));
  doc.setFont("helvetica", "bold"); doc.setFontSize(12);
  doc.text("VALOR TOTAL:", M + mm(5), ly); doc.text(brl(total), W - M - mm(5), ly, { align: "right" });

  /* merge dos comprovantes — a discriminação acima já detalha cada
     despesa numa linha; aqui só anexamos os comprovantes, com um
     rótulo identificando a despesa (sem repetir uma página inteira
     de detalhe por despesa). */
  const miolo = doc.output("arraybuffer");
  const PDFLibRef = window.PDFLib;
  const fim = await PDFLibRef.PDFDocument.load(miolo);
  const fonteRotulo = await fim.embedFont(PDFLibRef.StandardFonts.HelveticaBold);
  const rotulaAnexo = (pagina, it) => {
    const { width, height } = pagina.getSize();
    const texto = it.tipo + " · " + dBR(it.data) + " · " + brl(it.valor) + (it.comentario ? " · " + it.comentario.slice(0, 60) : "");
    pagina.drawRectangle({ x: 0, y: height - 20, width, height: 20, color: PDFLibRef.rgb(0.93, 0.71, 0) });
    pagina.drawText(texto, { x: 8, y: height - 14, size: 8, font: fonteRotulo, color: PDFLibRef.rgb(0.15, 0.15, 0.15) });
  };
  for (const it of itens) {
    if (!it.anexoData) continue;
    try {
      const b64 = it.anexoData.split(",")[1];
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      if (it.anexoData.indexOf("data:application/pdf") === 0) {
        const src = await PDFLibRef.PDFDocument.load(bytes);
        const copiadas = await fim.copyPages(src, src.getPageIndices());
        copiadas.forEach((p, i) => { fim.addPage(p); if (i === 0) rotulaAnexo(p, it); });
      } else if (/^data:image\/(jpe?g)/.test(it.anexoData)) {
        const img = await fim.embedJpg(bytes); const pg = fim.addPage([595.28, 841.89]);
        const d = img.scaleToFit(515, 740);
        pg.drawImage(img, { x: (595.28 - d.width) / 2, y: (841.89 - d.height - 40) / 2, width: d.width, height: d.height });
        rotulaAnexo(pg, it);
      } else if (it.anexoData.indexOf("data:image/png") === 0) {
        const img = await fim.embedPng(bytes); const pg = fim.addPage([595.28, 841.89]);
        const d = img.scaleToFit(515, 740);
        pg.drawImage(img, { x: (595.28 - d.width) / 2, y: (841.89 - d.height - 40) / 2, width: d.width, height: d.height });
        rotulaAnexo(pg, it);
      }
    } catch (e) { console.warn("Anexo não mesclado:", it.anexoNome, e); }
  }
  const bytes = await fim.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = rel.codigo + ".pdf"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 800);
}
