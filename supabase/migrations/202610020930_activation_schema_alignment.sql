-- Education OS activation hardening
-- Align payment-triggered student activation with the live production schema.
create unique index if not exists uq_enrollments_student_program_org
on public.enrollments(student_id, program_id, organization_id)
where status='active';

create or replace function private.finalize_paid_student_registration()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $function$
declare
  v_app public.registration_applications%rowtype;
  v_profile public.student_registration_profiles%rowtype;
  v_profile_id uuid;
  v_student_id uuid;
begin
  if new.status <> 'paid' or coalesce(old.status,'') = 'paid' then return new; end if;
  if new.registration_application_id is null then return new; end if;

  select * into v_app from public.registration_applications
  where id=new.registration_application_id and requested_role='student';
  if not found then return new; end if;

  select * into v_profile from public.student_registration_profiles
  where application_id=v_app.id limit 1;
  if not found then raise exception 'Profil pendaftaran siswa belum lengkap'; end if;

  select id into v_profile_id from public.profiles
  where user_id=v_app.user_id limit 1;
  if v_profile_id is null then raise exception 'Profile Education OS kandidat belum tersedia'; end if;

  select id into v_student_id from public.students
  where profile_id=v_profile_id and organization_id=v_app.organization_id limit 1;

  if v_student_id is null then
    insert into public.students(profile_id,organization_id,status,grade_level,date_of_birth,created_at,updated_at)
    values(v_profile_id,v_app.organization_id,'active',v_profile.grade_level,v_profile.date_of_birth,now(),now())
    returning id into v_student_id;
  else
    update public.students set status='active',
      grade_level=coalesce(v_profile.grade_level,grade_level),
      date_of_birth=coalesce(v_profile.date_of_birth,date_of_birth),
      updated_at=now() where id=v_student_id;
  end if;

  insert into public.organization_members(organization_id,user_id,role,status,created_at,updated_at)
  values(v_app.organization_id,v_app.user_id,'student','active',now(),now())
  on conflict(organization_id,user_id,role) do update set status='active',updated_at=now();

  if v_app.selected_program_id is not null then
    insert into public.enrollments(student_id,program_id,organization_id,status,started_at,created_at)
    values(v_student_id,v_app.selected_program_id,v_app.organization_id,'active',now(),now())
    on conflict do nothing;
  end if;

  update public.invoices set status='paid',paid_at=coalesce(new.paid_at,now()),student_id=v_student_id
  where id=new.invoice_id;

  update public.registration_applications set status='completed',
    paid_at=coalesce(new.paid_at,now()),updated_at=now() where id=v_app.id;

  return new;
end;
$function$;

revoke all on function private.finalize_paid_student_registration() from public, anon, authenticated;