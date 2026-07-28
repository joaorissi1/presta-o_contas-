import { NextResponse } from "next/server";
import { mudarStatusLote } from "@/lib/reportsRepo";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    const count = await mudarStatusLote(ids, "aprovar");
    return NextResponse.json({ count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao aprovar em lote." }, { status: 500 });
  }
}
