-- Slug'ı TR isme çevir (içerik aynı kalır; TR=TR, EN=EN).
-- Eski: /tr/blog/first-8-seconds  →  /tr/blog/lobide-ilk-8-saniye

update public.blog_posts
set
  slug = 'lobide-ilk-8-saniye',
  updated_at = now()
where slug = 'first-8-seconds';
