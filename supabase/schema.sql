-- BGA 回答ログ用スキーマ。Supabase の SQL Editor に貼って実行する。
-- 個人を特定する情報は保存しない（IP / UA / Cookie なし）。

create extension if not exists "pgcrypto";

create table if not exists public.responses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  score_version   int  not null,
  answers         jsonb not null,          -- { "n01": ["S","D","A","H"], ... }
  normal_scores   jsonb not null,          -- { "S": 30, "D": 28, ... }
  pressure_scores jsonb not null,
  type_code       text not null,           -- "SD" など
  normal_clear    boolean not null,
  pressure_clear  boolean not null,
  shift_index     real not null,
  duration_ms     int
);

create table if not exists public.tipi_responses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  response_id uuid not null references public.responses(id) on delete cascade,
  answers     jsonb not null,              -- { "1": 5, "2": 3, ... }
  scores      jsonb not null               -- { "E": 9, "A": 11, ... }
);

create index if not exists responses_created_at_idx on public.responses (created_at);
create index if not exists responses_type_code_idx on public.responses (type_code);
create index if not exists tipi_responses_response_id_idx on public.tipi_responses (response_id);

-- サーバーの service role key からしか書き込まないので、匿名アクセスは全て遮断する
alter table public.responses enable row level security;
alter table public.tipi_responses enable row level security;
