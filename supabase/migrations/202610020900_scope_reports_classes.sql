-- Education OS scope hardening: reports and class groups
drop policy if exists learning_reports_member_read on public.learning_reports;

create policy learning_reports_scoped_read on public.learning_reports
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or private.is_mentor_of_student(student_id)
  or private.is_parent_of_student(student_id)
  or exists (
    select 1 from public.students s
    where s.id = learning_reports.student_id
      and s.profile_id = public.current_profile_id()
  )
);

drop policy if exists class_groups_select on public.class_groups;

create policy class_groups_select on public.class_groups
for select to authenticated
using (
  private.is_org_staff(organization_id)
  or private.is_org_mentor(organization_id)
);
