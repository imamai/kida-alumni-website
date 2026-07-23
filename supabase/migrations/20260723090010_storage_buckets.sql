-- Storage buckets: kida-media (CMS-managed public assets) and kida-avatars (user profile photos).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('kida-media', 'kida-media', true, 26214400, array['image/png','image/jpeg','image/webp','image/svg+xml','video/mp4']),
  ('kida-avatars', 'kida-avatars', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- kida-media: publicly readable, only staff can upload/modify/delete.
create policy "kida_media_bucket_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'kida-media');

create policy "kida_media_bucket_staff_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'kida-media' and kida_is_staff());

create policy "kida_media_bucket_staff_update" on storage.objects
  for update to authenticated using (bucket_id = 'kida-media' and kida_is_staff())
  with check (bucket_id = 'kida-media' and kida_is_staff());

create policy "kida_media_bucket_staff_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'kida-media' and kida_is_staff());

-- kida-avatars: publicly readable, each user manages only their own folder (avatars/<user_id>/...).
create policy "kida_avatars_bucket_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'kida-avatars');

create policy "kida_avatars_bucket_owner_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'kida-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "kida_avatars_bucket_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'kida-avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'kida-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "kida_avatars_bucket_owner_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'kida-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
