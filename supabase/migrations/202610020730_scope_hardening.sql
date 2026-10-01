-- Education OS data-scope hardening
-- Applied to production Supabase before recording this migration.
-- Finance, CRM, document and OSN reads now follow relationship/function scope.

drop policy if exists invoices_org_read on public.invoices;
create policy invoices_org_read on public.invoices
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or exists (select 1 from public.students s where s.id=invoices.student_id and s.profile_id=public.current_profile_id())
  or private.is_parent_of_student(student_id)
);

drop policy if exists payments_org_read on public.payments;
create policy payments_org_read on public.payments
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or exists (
    select 1 from public.invoices i
    where i.id=payments.invoice_id
      and (
        exists (select 1 from public.students s where s.id=i.student_id and s.profile_id=public.current_profile_id())
        or private.is_parent_of_student(i.student_id)
      )
  )
);

drop policy if exists crm_contacts_select on public.crm_contacts;
create policy crm_contacts_select on public.crm_contacts
for select to authenticated
using (public.is_org_operator(organization_id));

drop policy if exists crm_activities_select on public.crm_activities;
create policy crm_activities_select on public.crm_activities
for select to authenticated
using (public.is_org_operator(organization_id));

drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or (
    entity_type='student'
    and exists (
      select 1 from public.students s
      where s.id=documents.entity_id
        and (
          s.profile_id=public.current_profile_id()
          or private.is_parent_of_student(s.id)
          or private.is_mentor_of_student(s.id)
        )
    )
  )
);

drop policy if exists osn_enrollments_org_read on public.osn_enrollments;
create policy osn_enrollments_org_read on public.osn_enrollments
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or private.is_mentor_of_student(student_id)
  or private.is_parent_of_student(student_id)
  or exists (select 1 from public.students s where s.id=osn_enrollments.student_id and s.profile_id=public.current_profile_id())
);

drop policy if exists osn_attempts_student_read on public.osn_attempts;
create policy osn_attempts_student_read on public.osn_attempts
for select to authenticated
using (
  private.is_org_staff((select s.organization_id from public.osn_simulations s where s.id=osn_attempts.simulation_id))
  or private.is_mentor_of_student(student_id)
  or private.is_parent_of_student(student_id)
  or exists (select 1 from public.students s where s.id=osn_attempts.student_id and s.profile_id=public.current_profile_id())
);
