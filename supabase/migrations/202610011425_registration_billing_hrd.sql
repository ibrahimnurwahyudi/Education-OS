-- Applied to the Education OS Supabase project on 2026-10-01.
-- This file records the production registration/billing/HRD hardening.

create unique index if not exists uq_invoices_registration_application
on public.invoices(registration_application_id)
where registration_application_id is not null;

create or replace function private.resolve_registration_organization(p_selected_program_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare v_org uuid;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  if p_selected_program_id is not null then
    select organization_id into v_org from public.programs
    where id = p_selected_program_id and status = 'active';
    if v_org is null then raise exception 'Program tidak ditemukan atau tidak aktif'; end if;
    return v_org;
  end if;
  select id into v_org from public.organizations
  where status = 'active' order by created_at limit 1;
  return v_org;
end
$function$;

revoke all on function private.resolve_registration_organization(uuid) from public;
grant execute on function private.resolve_registration_organization(uuid) to authenticated;

create or replace function public.create_registration_application(
  p_requested_role text,
  p_full_name text,
  p_email text,
  p_phone text default null,
  p_payload jsonb default '{}'::jsonb,
  p_selected_program_id uuid default null
) returns uuid
language plpgsql
security invoker
set search_path = public
as $function$
declare v_id uuid; v_org uuid;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  if p_requested_role not in ('student','parent','mentor','osn_mentor','institution') then
    raise exception 'Role pendaftaran tidak valid';
  end if;
  v_org := private.resolve_registration_organization(p_selected_program_id);
  insert into public.registration_applications(
    user_id, organization_id, requested_role, full_name, email, phone,
    payload, selected_program_id, status, submitted_at
  ) values (
    (select auth.uid()), v_org, p_requested_role, p_full_name, p_email,
    p_phone, coalesce(p_payload,'{}'::jsonb), p_selected_program_id,
    'submitted', now()
  ) returning id into v_id;
  return v_id;
end
$function$;

drop policy if exists invoices_registration_applicant_read on public.invoices;
create policy invoices_registration_applicant_read on public.invoices
for select to authenticated using (
  exists (select 1 from public.registration_applications a
    where a.id = invoices.registration_application_id and a.user_id = (select auth.uid()))
);

drop policy if exists invoices_registration_applicant_insert on public.invoices;
create policy invoices_registration_applicant_insert on public.invoices
for insert to authenticated with check (
  registration_application_id is not null
  and exists (select 1 from public.registration_applications a
    where a.id = invoices.registration_application_id
      and a.user_id = (select auth.uid())
      and a.requested_role = 'student'
      and a.organization_id = invoices.organization_id)
  and exists (select 1 from public.registration_applications a
    join public.billing_items b on b.organization_id = a.organization_id
      and b.active = true
      and (b.program_id = a.selected_program_id or b.program_id is null)
    where a.id = invoices.registration_application_id
      and b.amount_cents = invoices.amount_cents
      and b.currency = invoices.currency)
);

create or replace function public.prepare_registration_billing(p_application_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $function$
declare a public.registration_applications%rowtype; b public.billing_items%rowtype; i public.invoices%rowtype;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  select * into a from public.registration_applications
  where id = p_application_id and user_id = (select auth.uid()) for update;
  if not found then raise exception 'Pendaftaran tidak ditemukan'; end if;
  if a.requested_role <> 'student' then return jsonb_build_object('required', false, 'reason', 'role_not_billable'); end if;
  if a.organization_id is null then raise exception 'Organisasi pendaftaran belum ditentukan'; end if;
  select * into i from public.invoices where registration_application_id = a.id order by created_at desc limit 1;
  if found then return jsonb_build_object('required', true, 'invoice_id', i.id, 'amount_cents', i.amount_cents, 'currency', i.currency, 'status', i.status); end if;
  select * into b from public.billing_items
  where organization_id = a.organization_id and active = true
    and (program_id = a.selected_program_id or program_id is null)
  order by (program_id is null), created_at limit 1;
  if not found then return jsonb_build_object('required', false, 'reason', 'no_active_billing_item'); end if;
  insert into public.invoices(organization_id, student_id, amount_cents, currency, status, due_at, registration_application_id)
  values (a.organization_id, null, b.amount_cents, b.currency, 'pending', now() + interval '7 days', a.id)
  returning * into i;
  update public.registration_applications set status='payment_pending', updated_at=now() where id=a.id;
  return jsonb_build_object('required', true, 'invoice_id', i.id, 'amount_cents', i.amount_cents, 'currency', i.currency, 'status', i.status);
end
$function$;

revoke all on function public.prepare_registration_billing(uuid) from public;
revoke all on function public.prepare_registration_billing(uuid) from anon;
grant execute on function public.prepare_registration_billing(uuid) to authenticated;

drop policy if exists mentor_applications_hrd_select on public.mentor_applications;
create policy mentor_applications_hrd_select on public.mentor_applications
for select to authenticated using (
  user_id = (select auth.uid())
  or exists (select 1 from public.organization_members om
    where om.user_id = (select auth.uid()) and om.status = 'active'
      and om.role in ('hrd','admin','institution_owner','academic_director')
      and om.organization_id = mentor_applications.organization_id)
);
