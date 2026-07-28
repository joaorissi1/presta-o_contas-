import { NextResponse } from "next/server";
import { listarRelatorios, salvarRelatorio } from "@/lib/reportsRepo";

export async function GET() {
  try {
    const relatorios = await listarRelatorios();
    return NextResponse.json({ relatorios });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar relatórios." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rel = await salvarRelatorio(body);
    return NextResponse.json(rel);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao salvar relatório." }, { status: 500 });
  }
}
