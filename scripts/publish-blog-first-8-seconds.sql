-- Supabase SQL Editor'da çalıştır (Production projesi).
-- Kapak: mevcut blog görsellerinden biri (ileride özel görsel değiştirilebilir).

insert into public.blog_posts (
  slug, baslik, title, aciklama, description, kapak, yayinda, bolumler
) values (
  'first-8-seconds',
  'Lobide ilk 8 saniye neden her şeyi belirler',
  'Why the first 8 seconds in the lobby decide everything',
  $tr_intro$Misafir kapıdan girer. Henüz check-in yok, henüz oda yok. Ama karar çoktan oluşmaya başlamıştır: “Burada kendimi önemli hissediyor muyum, yoksa sıraya mı girdim?”

Bu kararın çoğu bilinçli değil. Koku, ışık, ses yüksekliği, birinin bakış süresi, zeminin sesi. Beyin güveni hızlı tartar; lüksü katalogdan değil, bedenden okur.$tr_intro$,
  $en_intro$A guest walks through the door. No check-in yet, no room yet. But a decision is already forming: “Do I feel valued here, or am I just in line?”

Most of that decision is not conscious. Scent, light, volume, how long someone looks at you, the sound of the floor. The brain sizes up trust fast. It reads luxury from the body, not from a brochure.$en_intro$,
  'https://res.cloudinary.com/di0qbhh46/image/upload/kruv-portfolio/blog/premium-whitespace.png',
  true,
  $sections$[
    {
      "baslik": "Sosyal medya sayfası dijital lobidir",
      "title": "Your social feed is the digital lobby",
      "metin": "Aynı refleks telefonda da var. Biri oteli veya restoranı ilk kez Instagram’da, TikTok’ta, belki bir Reels karesinde görür. O kare lobinin kapısıdır. Işık, tempo, yüz ifadesi, yazı tipi, boşluk… Misafir “güzel mekan” demeden önce “ben buraya ait miyim?” diye sorar.\n\nSosyal medya sayfası süs değil; dijital lobidir. Düzensiz grid, rastgele filtre, özensiz story ritmi, lobideki fazla yüksek müzik kadar bozar. Güçlü bir sosyal vitrin tek başına yetmez ama zayıf bir sosyal vitrin her şeyi bozar.\n\nSite, rezervasyon, menü: bunlar ikinci kapı. İlk kapı çoğu zaman telefonun içinde açılır. Fotoğraf “sessiz bir akşam” diyorsa, story temposu da o geceyi taşımalı; profil bio’su da, öne çıkanlar da, kaydırırken hissedilen düzen de. Acele ettiren metin, kalabalık kapak, üç farklı dil… küçük gibi durur; aslında karşılama bozulmuştur.",
      "text": "The same reflex lives on the phone. Someone first meets a hotel or restaurant on Instagram, TikTok, maybe a single Reels frame. That frame is the lobby door. Light, pace, expression, type, space… Before they say “nice place,” they ask “do I belong here?”\n\nA social page is not decoration. It is the digital lobby. A messy grid, random filters, a careless story rhythm damage the feeling as much as music turned too loud in a real lobby. A strong social presence is not enough on its own, but a weak one breaks everything.\n\nWebsite, booking, menu: those are the second door. The first door usually opens inside the phone. If the photo says “a quiet evening,” the story pace should carry that night too, along with the bio, the highlights, and the order you feel while scrolling. Rushed copy, a crowded cover, three competing tones… they look small, but the welcome is already broken.",
      "gorsel": ""
    },
    {
      "baslik": "İlk kaydırmada ne hissediliyor?",
      "title": "What do they feel on the first scroll?",
      "metin": "Kruv olarak baktığımız yer tam burası: sosyal medyada duruş, ritm ve görünüm. Misafiri içeri davet eden dil buradan kurulur; site ve diğer kanallar bunu tamamlar, onun yerine geçmez.\n\nSoru şu: Misafirinizin ilk 8 saniyesinde (çoğu zaman bir kaydırmada) neyi hissettiriyorsunuz: davet mi, gürültü mü?\n\nMarkanızın dijital lobisini netleştirmek isterseniz, projelerimize göz atabilir veya kruv.com üzerinden bizimle konuşabilirsiniz.",
      "text": "That is exactly where we look at Kruv: posture, rhythm, and appearance on social. The language that invites a guest in is built here. The website and other channels complete it; they do not replace it.\n\nSo: in your guest’s first 8 seconds (often one scroll), what do you make them feel: an invitation, or noise?\n\nIf you want to sharpen your brand’s digital lobby, browse our work or talk to us at kruv.com.",
      "gorsel": ""
    }
  ]$sections$::jsonb
)
on conflict (slug) do update set
  baslik = excluded.baslik,
  title = excluded.title,
  aciklama = excluded.aciklama,
  description = excluded.description,
  kapak = excluded.kapak,
  yayinda = excluded.yayinda,
  bolumler = excluded.bolumler,
  updated_at = now();
