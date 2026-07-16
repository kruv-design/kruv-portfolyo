-- Protel /protel sayfa şifresi (service role — public okuma yok)
create table if not exists public.protel_page_secrets (
  id            int primary key default 1 check (id = 1),
  page_password text not null default 'protelkruv',
  updated_at    timestamptz not null default now()
);

insert into public.protel_page_secrets (id, page_password)
values (1, 'protelkruv')
on conflict (id) do nothing;

drop trigger if exists protel_page_secrets_touch on public.protel_page_secrets;
create trigger protel_page_secrets_touch
  before update on public.protel_page_secrets
  for each row execute function public.touch_updated_at();

alter table public.protel_page_secrets enable row level security;
