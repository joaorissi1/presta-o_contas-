-- Prestação de Contas — schema inicial
-- Rode este script uma vez no Supabase: Dashboard > SQL Editor > New query > Run

create table if not exists relatorios (
  id bigint generated always as identity primary key,
  codigo text not null,
  funcionario_id text,
  funcionario_nome text,
  projeto text,
  periodo_ini text,
  periodo_fim text,
  status text not null default 'rascunho',
  motivo_rejeicao text,
  itens jsonb not null default '[]',
  historico jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists relatorios_status_idx on relatorios (status);
create index if not exists relatorios_codigo_idx on relatorios (codigo);

-- RLS fica desligado de propósito: este app não tem login, e todo
-- acesso ao banco passa pelas rotas de API do Next.js (usando a
-- service_role key, que só existe no servidor). Ninguém acessa esta
-- tabela direto do navegador.
alter table relatorios disable row level security;

-- Contador atômico do código "PC-<ano>-NNNN" — evita que duas
-- submissões simultâneas recebam o mesmo número.
create table if not exists contadores (
  chave text primary key,
  valor integer not null default 0
);

create or replace function proximo_contador(p_chave text)
returns integer
language plpgsql
as $$
declare
  novo_valor integer;
begin
  insert into contadores (chave, valor) values (p_chave, 1)
  on conflict (chave) do update set valor = contadores.valor + 1
  returning valor into novo_valor;
  return novo_valor;
end;
$$;
