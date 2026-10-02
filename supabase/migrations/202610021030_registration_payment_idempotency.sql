-- Production hardening applied to Education OS Supabase on 2026-10-02.
-- Registration payments are idempotent: one paid payment per registration application.

create unique index if not exists uq_registration_paid_payment
on public.payments(registration_application_id)
where registration_application_id is not null and status='paid';

create or replace function public.record_registration_payment(
  p_invoice_id uuid,
  p_provider text default 'manual',
  p_provider_reference text default null
) returns uuid
language plpgsql
set search_path = public
as $function$
declare
  i public.invoices%rowtype;
  v_uid uuid := auth.uid();
  v_payment_id uuid;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;

  select * into i
  from public.invoices
  where id=p_invoice_id
    and registration_application_id is not null
  for update;

  if not found then raise exception 'Invoice registration tidak ditemukan'; end if;

  if not exists (
    select 1 from public.organization_members m
    where m.organization_id=i.organization_id
      and m.user_id=v_uid
      and m.status='active'
      and m.role in ('finance','admin','institution_owner')
  ) then
    raise exception 'Akses Finance diperlukan';
  end if;

  select id into v_payment_id
  from public.payments
  where registration_application_id=i.registration_application_id
    and status='paid'
  order by paid_at desc nulls last, created_at desc
  limit 1;

  if v_payment_id is not null then
    return v_payment_id;
  end if;

  insert into public.payments(
    organization_id,invoice_id,provider,provider_reference,
    amount_cents,status,paid_at,registration_application_id
  )
  values(
    i.organization_id,i.id,p_provider,p_provider_reference,
    i.amount_cents,'paid',now(),i.registration_application_id
  )
  returning id into v_payment_id;

  return v_payment_id;
end
$function$;

revoke all on function public.record_registration_payment(uuid,text,text) from public;
revoke all on function public.record_registration_payment(uuid,text,text) from anon;
grant execute on function public.record_registration_payment(uuid,text,text) to authenticated;
