-- Registration document update + storage upsert hardening
-- Applied to Supabase project cbuunkkmpwwflxlqypxn

drop policy if exists application_documents_owner_update on public.application_documents;
create policy application_documents_owner_update on public.application_documents
for update to authenticated
using (
  exists (
    select 1 from public.registration_applications a
    where a.id=application_documents.application_id
      and a.user_id=(select auth.uid())
      and a.status not in ('completed','rejected')
  )
)
with check (
  exists (
    select 1 from public.registration_applications a
    where a.id=application_documents.application_id
      and a.user_id=(select auth.uid())
      and a.status not in ('completed','rejected')
  )
);

drop policy if exists hr_application_update on storage.objects;
create policy hr_application_update on storage.objects
for update to authenticated
using (
  bucket_id='hr-applications'
  and (storage.foldername(name))[1]=(select auth.uid())::text
)
with check (
  bucket_id='hr-applications'
  and (storage.foldername(name))[1]=(select auth.uid())::text
);

create unique index if not exists uq_application_documents_identity
on public.application_documents(application_id, document_type, file_name);
