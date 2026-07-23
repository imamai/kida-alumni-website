-- Demo content for local/dev environments. Safe to re-run (guarded by NOT EXISTS checks on slug/name).
-- Run after migrations: `supabase db push --include-seed` or `psql < supabase/seed.sql`.
-- Media rows point at Unsplash placeholders (storage_path = 'external/...') — replace via the
-- admin Media Library once real photography is available.

insert into kida_media (storage_path, url, type, alt_text, folder)
select * from (values
  ('external/unsplash/leadership-1', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop', 'image', 'Portrait placeholder', 'leadership'),
  ('external/unsplash/leadership-2', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', 'image', 'Portrait placeholder', 'leadership'),
  ('external/unsplash/leadership-3', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop', 'image', 'Portrait placeholder', 'leadership'),
  ('external/unsplash/testimonial-1', 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop', 'image', 'Portrait placeholder', 'testimonials'),
  ('external/unsplash/news-1', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop', 'image', 'Campus placeholder', 'news'),
  ('external/unsplash/news-2', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop', 'image', 'Campus placeholder', 'news'),
  ('external/unsplash/event-1', 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop', 'image', 'Event placeholder', 'events')
) as v(storage_path, url, type, alt_text, folder)
where not exists (select 1 from kida_media m where m.storage_path = v.storage_path);

-- Leadership
insert into kida_leadership (full_name, title, category, bio, photo_media_id, sort_order)
select 'Dr. Peter Wanyama', 'Chairperson', 'executive',
  'Class of 1989. Public health specialist leading KIDA''s strategic vision since 2022.',
  (select id from kida_media where storage_path = 'external/unsplash/leadership-1'), 1
where not exists (select 1 from kida_leadership where full_name = 'Dr. Peter Wanyama');

insert into kida_leadership (full_name, title, category, bio, photo_media_id, sort_order)
select 'Grace Nafula', 'Vice Chairperson', 'executive',
  'Class of 1994. Corporate lawyer and advocate for the KIDA Scholarship Fund.',
  (select id from kida_media where storage_path = 'external/unsplash/leadership-2'), 2
where not exists (select 1 from kida_leadership where full_name = 'Grace Nafula');

insert into kida_leadership (full_name, title, category, bio, photo_media_id, sort_order)
select 'Hon. Samuel Wafula', 'Patron', 'patron',
  'Class of 1978. Long-serving patron and founding member of KIDA.',
  (select id from kida_media where storage_path = 'external/unsplash/leadership-3'), 1
where not exists (select 1 from kida_leadership where full_name = 'Hon. Samuel Wafula');

-- Testimonials
insert into kida_testimonials (author_name, author_title, quote, author_photo_media_id, status, is_featured, sort_order)
select 'Janet Achieng', 'Class of 2009 · Software Engineer, Nairobi',
  'KIDA connected me with a mentor who helped me land my first tech job. Ten years later, I''m paying it forward as a mentor myself.',
  (select id from kida_media where storage_path = 'external/unsplash/testimonial-1'), 'published', true, 1
where not exists (select 1 from kida_testimonials where author_name = 'Janet Achieng');

insert into kida_testimonials (author_name, author_title, quote, status, is_featured, sort_order)
select 'Moses Kiptoo', 'Class of 1997 · County Government Officer',
  'The annual homecoming is the highlight of my year — nowhere else can I reconnect with classmates from three decades ago.',
  'published', true, 2
where not exists (select 1 from kida_testimonials where author_name = 'Moses Kiptoo');

-- News
insert into kida_news (type, title, slug, excerpt, status, published_at, cover_media_id)
select 'news', 'KIDA Launches 2026 Scholarship Fund Drive', 'kida-launches-2026-scholarship-fund-drive',
  'This year''s fund aims to support 50 needy students at Kibabii High School with full tuition coverage.',
  'published', now() - interval '3 days',
  (select id from kida_media where storage_path = 'external/unsplash/news-1')
where not exists (select 1 from kida_news where slug = 'kida-launches-2026-scholarship-fund-drive');

insert into kida_news (type, title, slug, excerpt, status, published_at, cover_media_id)
select 'announcement', 'Annual General Meeting Set for September', 'agm-set-for-september',
  'All fully paid-up members are invited to the 2026 Annual General Meeting at Kibabii High School.',
  'published', now() - interval '1 day',
  (select id from kida_media where storage_path = 'external/unsplash/news-2')
where not exists (select 1 from kida_news where slug = 'agm-set-for-september');

-- Events
insert into kida_events (title, slug, description, category, status, start_at, location_name, county, cover_media_id)
select 'KIDA Annual Homecoming & Reunion', 'kida-annual-homecoming-reunion',
  'Join fellow Kibabiians for a weekend of reconnection, mentorship sessions, and celebration at Kibabii High School.',
  'homecoming', 'published', now() + interval '45 days', 'Kibabii High School', 'Bungoma',
  (select id from kida_media where storage_path = 'external/unsplash/event-1')
where not exists (select 1 from kida_events where slug = 'kida-annual-homecoming-reunion');

insert into kida_events (title, slug, description, category, status, start_at, is_virtual, virtual_link)
select 'Nairobi Chapter Networking Evening', 'nairobi-chapter-networking-evening',
  'An evening of networking and mentorship for Kibabiians based in and around Nairobi.',
  'networking', 'published', now() + interval '20 days', true, 'https://meet.google.com/kida-nairobi'
where not exists (select 1 from kida_events where slug = 'nairobi-chapter-networking-evening');

-- Partners
insert into kida_partners (name, type, tier, status, sort_order)
select 'Bungoma County Government', 'partner', 'gold', 'active', 1
where not exists (select 1 from kida_partners where name = 'Bungoma County Government');

insert into kida_partners (name, type, tier, status, sort_order)
select 'Equity Bank Foundation', 'sponsor', 'gold', 'active', 2
where not exists (select 1 from kida_partners where name = 'Equity Bank Foundation');

-- FAQs
insert into kida_faqs (question, answer, category, sort_order)
select 'Who can become a KIDA member?', 'Any former student of Kibabii High School is eligible to register as a KIDA member, subject to admission number verification.', 'membership', 1
where not exists (select 1 from kida_faqs where question = 'Who can become a KIDA member?');

insert into kida_faqs (question, answer, category, sort_order)
select 'How is my membership verified?', 'After you sign up, a KIDA Membership Officer cross-checks your admission number and graduation year against school records before approving full access.', 'membership', 2
where not exists (select 1 from kida_faqs where question = 'How is my membership verified?');

refresh materialized view kida_mv_alumni_stats;
