# Haftalık not

Her pazartesi bir sayı. Kısa, okunur, tek mercek. Aynı iskelet. Aynı dosya düzeni.

Bu dosya altyapıdır. Sayılar `issues/` altındadır. Ne yayınlandığı ve sırada ne olduğu `kayit.md` içindedir. İzlenecek yerler `kaynaklar.md` içindedir.

## Vuruşlar

Okur bu adları görmez. Başlıklar sahneyi söyler. Vuruş, yazının iç sırasıdır.

1. **Eşik.** Girişin ilk paragrafı. Misafirin girdiği somut bir an. Mekan, ışık, bir cümle.
2. **Soru.** Girişin kapanışı. Tek soru. Yazının geri kalanı bunu cevaplar.
3. **İz.** Bu hafta gerçekten bakılan yüzey. En fazla iki sahne. Uydurma detay yok.
4. **Tat.** Akılda kalan tek ayrıntı. Bir boşluk, bir damga, bir tempo. Bilgi burada keyif verir.
5. **Çizik.** Markanın duygusunu bozan tekrar eden hata. Suçlama değil, kırılma.
6. **Kapı.** Bu hafta uygulanacak tek hareket. Kapanışta bir cümle. Kruv’a davet tek cümledir.

Giriş (`aciklama` / `description`) eşik + sorudur. Dört bölüm sırasıyla iz, tat, çizik, kapıdır. İlk iki bölümde görsel vardır.

## Sayı dosyası

`content/haftalik/issues/YYYY-MM-DD.json`

- `sayi` ve `tarih` aynı gündür. Pazartesi.
- `slug` Türkçe, ASCII, tireli. TR ve EN aynı slug.
- `mercek` kısa kimliktir. Üst üste tekrarlanmaz.
- `post.yayinda` onay olmadan `false` kalır.
- Metinler ayrı yazılır. TR alanına İngilizce, EN alanına Türkçe konmaz.
- Em dash (`—`) yok.
- `kaynaklar` bakılan sayfaları tutar. `bakilamayan` açılamayan kanalı dürüstçe yazar.

Kontrol:

```bash
npm run check:haftalik
```

## Görsel

Özgün kare. Başka sitenin fotoğrafı, ekran görüntüsü veya logo kopyası yok.

Dosya: `public/haftalik/YYYY-MM-DD/kapak.jpg`, `iz.jpg`, `tat.jpg`.

Yazı içinde yol: `/haftalik/YYYY-MM-DD/kapak.jpg`.

Onaylı yayında Cloudinary klasörü düz kalır:

`kruv-portfolio/blog/<slug>-kapak`
`kruv-portfolio/blog/<slug>-iz`
`kruv-portfolio/blog/<slug>-tat`

URL’ler ancak yüklemeden sonra sayı dosyasında değişir.

## Yayın

Onay olmadan Supabase’e yazılmaz, deploy edilmez. `yayinda: true` insan onayıdır. Onay gelince kapak ve bölüm görselleri Cloudinary’ye çıkar, sonra kayıt açılır.

## Haftalık tur

1. `kayit.md` oku. Son merceği ve son mekanları tekrarlama.
2. `kaynaklar.md` sırasından bu hafta dörtlüyü seç: tasarım yayını, otel sayfası, restoran sayfası veya menü, sosyal vitrin.
3. Aç. Not al. Açılamayanı `bakilamayan`a yaz. Yerine detay uydurma.
4. Tek mercek seç. Sıradaki mercek doluysa onu kullan, konu yetmezse gerekçeyle bir sonrakine geç ve kayda işle.
5. Sayıyı yaz. Görselleri üret. `npm run check:haftalik` çalışsın.
6. `kayit.md` içine sayıyı ekle, sıradaki merceği güncelle.
7. Önizleme: `/tr/blog/onizleme/YYYY-MM-DD` ve `/en/blog/onizleme/YYYY-MM-DD`. Üretim ortamında bu yol kapalıdır.

## Mercek sırası

Bitince başa dön. Yanına yeni mercek eklemek serbest. Silmek değil.

1. `soguk-devam`: sayfa güzel, sonraki adım (menü, oda listesi, rezervasyon, mail) soğuk
2. `sabah`: kahvaltı, sabah ışığı, otelin ilk saati
3. `kucuk-nesne`: anahtar kartı, tabela, peçete, fiş
4. `gece`: karanlık fotoğraf, gece menüsü, geç saat sayfası
5. `isim`: adın okunuşu, tabela, küçük punto
6. `masa`: menüde neyin önce okunduğu, fiyatın sayfadaki yeri, kâğıttaki boşluk
7. `yemek-isik`: tabakta ışığın yeri, fotoğrafçının duruşu, softbox ve ızgara
8. `katalog-hissi`: otel hesabının boş ve kusursuz durması, kalınmış hissi

`lobide-ilk-8-saniye` sosyal vitrini anlattı. Sosyal gözlem her sayıda bir kanal olarak durur. Sosyal, merceğin kendisi olmaz. Ta ki kayıtta ayrı bir sosyal sayı açılana kadar.

## Ses

Okur bir otelci ya da restoran sahibi. Tasarım terimi bilmek zorunda değil.

- İlk iki cümlede konu anlaşılsın. Başlık da düz Türkçe olsun. Bilmece kurma.
- Ses insan ağzı olsun. Soğuk kılavuz yok. Misafirin durduğu, baktığı, suratının düştüğü an yazıya girsin.
- Tam cümle yaz. "17 metrekare. Duş. Katalog." gibi telgraf yok.
- Yazıya şu kelimeler girmez: yüzey, envanter, mercek, vuruş. Mecazla kestirme yok.
- Özel isimden önce o şeyin ne olduğu söylensin. "Roma’da Experimental adlı otel."
- Önce fikir, sonra örnek. Örnek fikri açar, yerine geçmez.
- Bölüm başlığı da günlük dille yazılır.
- Kaynak listesi yazının içine dökülmez. Mekan geçiyorsa doğru ayrıntıyla geçer. Uydurulmuş metrekare, fiyat, alıntı yok.
