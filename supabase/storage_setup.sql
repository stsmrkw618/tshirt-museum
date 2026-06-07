-- Supabase Storage バケット作成（Supabase Dashboardで実行）
-- publicバケット：getPublicUrl()で直接表示可能
insert into storage.buckets (id, name, public)
values ('tshirts', 'tshirts', true);

-- 認証済みユーザーのみアップロード・更新・削除可能（閲覧はpublicなので不要）
create policy "authenticated users can upload tshirt images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tshirts');

create policy "authenticated users can update tshirt images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tshirts');

create policy "authenticated users can delete tshirt images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tshirts');
