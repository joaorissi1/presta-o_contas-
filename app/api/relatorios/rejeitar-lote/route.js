import { NextResponse } from "next/server";
import { mudarStatusLote } from "@/lib/reportsRepo";

export async function POST(request) {
  try {
    const { ids, motivo } = await request.json();
    const count = await mudarStatusLote(ids, "rejeitar", motivo);
    return NextResponse.json({ count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao recusar em lote." }, { status: 500 });
  }
}
