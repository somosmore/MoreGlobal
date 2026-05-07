-- Tabla dedicada para leads de masterclass/webinars
-- Separada de la tabla leads principal (que tiene campos del quiz de elegibilidad)
create table if not exists masterclass_leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  whatsapp text,
  country text,
  source text not null default 'masterclass-eb2niw-2026',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index idx_masterclass_leads_email on masterclass_leads (email);
create index idx_masterclass_leads_source on masterclass_leads (source);
create index idx_masterclass_leads_created on masterclass_leads (created_at desc);

-- RLS: permitir inserts desde anon (formulario público) y lectura para authenticated (admin)
alter table masterclass_leads enable row level security;

create policy "Anyone can insert masterclass leads"
  on masterclass_leads for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read masterclass leads"
  on masterclass_leads for select
  to authenticated
  using (true);
