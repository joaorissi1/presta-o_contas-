import "server-only";
import { createClient } from "@supabase/supabase-js";

/* Cliente Supabase com a service_role key — só pode ser importado por
   código que roda no servidor (rotas de API). A diretiva "server-only"
   faz o build falhar se isso for importado num Client Component.

   Criado sob demanda (não no carregamento do módulo): se as variáveis
   de ambiente ainda não estiverem configuradas, isso só falha quando
   uma rota de API de fato tentar usar o banco — não durante o build. */
let client = null;

export function getSupabaseAdmin() {
  if (!client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas.");
    }
    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return client;
}
