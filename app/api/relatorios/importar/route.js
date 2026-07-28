import { NextResponse } from "next/server";
import { importarRelatorios } from "@/lib/reportsRepo";

export async function POST(request) {
  try {
    const { relatorios } = await request.json();
    await importarRelatorios(relatorios || []);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao importar backup." }, { status: 500 });
  }
}
