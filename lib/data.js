/* ══════════════════════════════════════════════════════════════
   DATA — dados de referência estáticos (sem regra de negócio aqui)
   ══════════════════════════════════════════════════════════════ */

export const PC_USERS = [
  { id: "ana.sahm", nome: "Ana Luiza Sahm", cargo: "CONSULTOR JUNIOR" },
  { id: "branca.arioli", nome: "Branca Meneguim Arioli", cargo: "COORDENADOR ADMINISTRATIVO" },
  { id: "eduardo.rota", nome: "Eduardo Rota", cargo: "SÓCIO DIRETOR" },
  { id: "fabricio.lagamba", nome: "Fabricio La Gamba", cargo: "SÓCIO DIRETOR" },
  { id: "fernando.cantolini", nome: "Fernando Cantolini", cargo: "GERENTE" },
  { id: "fernando.reis", nome: "Fernando Reis", cargo: "DIRETOR" },
  { id: "gabriel.neto", nome: "Gabriel Neto", cargo: "TRAINEE" },
  { id: "gabriela.oliveira", nome: "Gabriela Oliveira", cargo: "CONSULTOR JUNIOR" },
  { id: "gustavo.teixeira", nome: "Gustavo Teixeira", cargo: "CONSULTOR SENIOR" },
  { id: "joao.sanches", nome: "João Gabriel Sanches", cargo: "CONSULTOR PLENO" },
  { id: "joao.rissi", nome: "João Lucas Rissi", cargo: "CONSULTOR JUNIOR" },
  { id: "joao.albano", nome: "João Victor Albano", cargo: "CONSULTOR JUNIOR" },
  { id: "lucas.theodoro", nome: "Lucas Theodoro", cargo: "SUPERVISOR" },
  { id: "lucas.vitorio", nome: "Lucas Vitorio", cargo: "SUPERVISOR" },
  { id: "marcelo.dopieri", nome: "Marcelo Dopieri", cargo: "TRAINEE" },
  { id: "matheus.correa", nome: "Matheus Pereira Correa", cargo: "CONSULTOR JUNIOR" },
  { id: "murilo.mello", nome: "Murilo Mello", cargo: "GERENTE" },
  { id: "nayara.santos", nome: "Nayara Santos", cargo: "CONSULTOR PLENO" },
  { id: "pedro.albino", nome: "Pedro Henrique Albino", cargo: "CONSULTOR SENIOR" },
  { id: "ramon.frias", nome: "Ramon Frias", cargo: "GERENTE" },
  { id: "ricardo.tanimoto", nome: "Ricardo Tanimoto", cargo: "DIRETOR" }
];

export const PC_LIM = { almoco: 40, jantar: 80, km: 1.60 };

export const PC_PROJ = [
  ["[CTRL] BRF - PMW", "Murilo Mello"], ["[CTRL] CMB", "Ricardo Tanimoto"],
  ["[CTRL] CAFÉ UTAM", "Fernando Cantolini"], ["[CTRL] DESPESAS SHOPPER", "Fernando Cantolini"],
  ["[CTRL] DISTRIAM", "Fernando Cantolini"], ["[CTRL] DUPCASH", "Lucas Vitorio"],
  ["[CTRL] GINGER", "Fernando Cantolini"], ["[CTRL] GUERINI", "Ramon Frias"],
  ["[CTRL] HDL HOSPITALAR", "Ricardo Tanimoto"], ["[CTRL] HAOMA", "Ricardo Tanimoto"],
  ["[CTRL] IRMÃOS KEHDI", "Ricardo Tanimoto"], ["[CTRL] JOB ENGENHARIA", "Fernando Cantolini"],
  ["[CTRL] MEVO", "Ramon Frias"], ["[CTRL] PET CAMP", "Ramon Frias"],
  ["[CTRL] PROPARTS", "Fernando Cantolini"], ["[CTRL] SHOPPER", "Fernando Cantolini"],
  ["[CTRL] TREINAMENTOS/TEMPLATES", "Fernando Cantolini"], ["[CTRL] LAPIMA", "Ramon Frias"],
  ["[INT] ADMINISTRATIVO", "Fabrício La Gamba"], ["[INT] ATESTADO", "Fernando Reis"],
  ["[INT] COMERCIAL", "Eduardo Rota"], ["[INT] FERIAS", "Fernando Reis"],
  ["[INT] TREINAMENTO", "Fabrício La Gamba"], ["[INT] SOLFARMA", "Fabrício La Gamba"],
  ["[INT] MARKETING", "Ramon Frias"],
  ["[FAS] ASS | GRUPO JAV 2024", "Fernando Reis"], ["[FAS] CPC32 | DG VENTURE 2025", "Fernando Reis"],
  ["[FAS] CPCS | ITG 2025", "Fernando Reis"], ["[FAS] DFS | AMAZÔNIA 2024", "Fernando Reis"],
  ["[FAS] DFS | IKHON 2023", "Fernando Reis"], ["[FAS] DFS | IKHON 2024", "Fernando Reis"],
  ["[FAS] DFS | NORDICA 2025", "Fernando Reis"], ["[FAS] DFS | PETCAMP 2025", "Fernando Reis"],
  ["[FAS] DFS | TENCHI 2025", "Fernando Reis"], ["[FAS] GC | MANGELS 2025", "Fernando Reis"],
  ["[FAS] IFRS 18 | MINERVA 2026", "Fernando Reis"], ["[FAS] IFRS18 | AERIS", "Fernando Reis"],
  ["[FAS] IT | DENTSPLY 2024", "Fernando Reis"], ["[FAS] IT | DG VENTURES 2024", "Fernando Reis"],
  ["[FAS] IT | LGI 2025", "Fernando Reis"], ["[FAS] IT | MANGELS 2025", "Fernando Reis"],
  ["[FAS] IT | MINERVA 2025", "Fernando Reis"], ["[FAS] IT | MODELO", "Fernando Reis"],
  ["[FAS] IT | MONTE CARLO 2025", "Fernando Reis"], ["[FAS] IT | MOVECTA 2025", "Fernando Reis"],
  ["[FAS] IT | PLUSOFT 2024", "Fernando Reis"], ["[FAS] IT | PLUSOFT 2025", "Fernando Reis"],
  ["[FAS] IT | SATUS AGER 2025", "Murilo Mello"], ["[FAS] IT | SIBRAPE 2025", "Fernando Reis"],
  ["[FAS] PL AVJ | HAVER&BOECKER 2024", "Ramon Frias"], ["[FAS] PL AVJ | QUERÊNCIA 2025", "Fernando Reis"],
  ["[FAS] PL AVJ | RB ASSETS 2025", "Fernando Reis"], ["[FAS] PPA | ALEXNEW 2025", "Fernando Reis"],
  ["[FAS] PPA | AUMA 2026", "Fernando Reis"], ["[FAS] PPA | CABONET-NIC NET 2025", "Fernando Reis"],
  ["[FAS] PPA | COMPANY HERO 2025", "Fernando Reis"], ["[FAS] PPA | CRESCI PERDI 2025", "Fernando Reis"],
  ["[FAS] PPA | IBIPAR-NIC NET 2025", "Fernando Reis"], ["[FAS] PPA | JOTEW 2024", "Fabrício La Gamba"],
  ["[FAS] PPA | MODELO", "Fernando Reis"], ["[FAS] PPA | NIC NET 2025", "Murilo Mello"],
  ["[FAS] PPA | OCEAN 2025", "Fernando Reis"], ["[FAS] PPA | WEB DIET 2025", "Fernando Reis"],
  ["[FAS] PLANEJAMENTO", "Fernando Reis"], ["[FAS] REV CAPAG | FITASSUL 2025", "Fernando Reis"],
  ["[FAS] REV CAPAG | KANAFLEX 2025", "Fernando Reis"], ["[FAS] TENCHI - DFS - 2025", "Fernando Reis"],
  ["[FAS] TENCHI - INTANGÍVEL - 2025", "Fernando Reis"], ["[FAS] TERRA VERDE", "Fernando Reis"],
  ["[FAS] TUDO DE BICHO - PPA", "Ramon Frias"], ["[FAS] TENCHI - SOP", "Fernando Reis"],
  ["[FAS] TOPAZ", "Fernando Reis"], ["[FAS] VAL | GRUPO JET 2024", "Fernando Reis"],
  ["[FAS] VALUATION | PAJUÇARA", "Ramon Frias"], ["[FAS] VS TELECON - VAL - 2025", "Fernando Reis"],
  ["[FAS] WIDE - NEOOH", "Fernando Reis"], ["[FAS] XXX | PET CARE 2024", "Ramon Frias"],
  ["[FAS] ADM", "Fernando Reis"], ["[FAS] PET CAMP - PPA - 2025", "Ramon Frias"],
  ["[FAS] HOMEFIN", "Ramon Frias"], ["[FAS] WEST AVES", "Ramon Frias"],
  ["[FAS] SRV PARTICIPAÇÕES - 2025", "Ramon Frias"], ["[FAS] PROMINAS", "Ramon Frias"],
  ["[FAS] HOPI HARI - DFS - 2025", "Ramon Frias"], ["[FAS] HYPECON", "Ramon Frias"],
  ["[CONS] FANTÁSTICO ALIMENTOS", "Eduardo Rota"], ["[CONS] SOLFARMA", "Fabrício La Gamba"],
  ["[TEC] DATA WAREHOUSE", "Ricardo Tanimoto"], ["[TEC] ODOO", "Ricardo Tanimoto"],
  ["[TEC] TECNOLOGIA", "Ricardo Tanimoto"],
  ["[CAAS] ATIVA HOSPITALAR", "Ricardo Tanimoto"], ["[CAAS] IMUNA BALÍSTICA", "Ramon Frias"]
];

export const PC_CATS = [
  ["Almoço", "Funcionario"], ["Jantar", "Funcionario"], ["Quilometragem", "Empresa"],
  ["Combustível", "Empresa"], ["Pedágio", "Funcionario"], ["Estacionamento", "Funcionario"],
  ["Transporte", "Funcionario"], ["Hospedagem", "Funcionario"], ["Cursos e Treinamentos", ""],
  ["Despesa Eventual", ""]
];

export const PC_CONTAS = [
  { n: "Rota e Associados Serviços Contábeis S/S Ltda", cnpj: "[preencher]", banco: "[preencher]", ag: "", cc: "", pix: "" },
  { n: "Valon Consult", cnpj: "[preencher]", banco: "[preencher]", ag: "", cc: "", pix: "" }
];
