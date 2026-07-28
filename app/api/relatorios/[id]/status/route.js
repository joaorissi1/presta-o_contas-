import { NextResponse } from "next/server";
import { mudarStatus } from "@/lib/reportsRepo";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { action, motivo } = await request.json();
    const rel = await mudarStatus(+id, action, motivo);
    return NextResponse.json(rel);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar status." }, { status: 500 });
  }
}
