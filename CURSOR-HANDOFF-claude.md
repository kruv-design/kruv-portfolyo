# Cursor devir notu — Claude oturumu (14–16 Ekim 2026)

Bu dosya, Claude ile yapılan kruv.com değişikliklerini ve açık işleri anlatır.
Cursor: işe başlamadan önce bu dosyayı oku, sonra `git status` ile durumu doğrula.

---

## 1. Hızlı özet

| Konu | Durum |
|---|---|
| Hero başlık + alt metin (hospitality) | ✅ Canlıda (commit `82a9f48`, `bb09d85`) |
| Müşteri video bölümü ("Yönettiğimiz sosyal medya hesapları") | ⏳ Tekrar açıldı, **commit/push bekliyor** |
| Admin şifre kapısı (kruvtest ile aynı panel) | ⏳ Yazıldı + yerelde test edildi, **commit/push bekliyor** |
| Vercel `DASHBOARD_PASSWORD` (kruv.com projesi) | ❌ **Tanımlı değil — push'tan ÖNCE eklenmeli** |
| GG Pizza videolarının değişmesi | ❌ Yapılamadı (admin kaydetme env yüzünden çalışmıyordu) |
| Ana sayfanın geri kalanı hospitality'ye çevrilmesi | 📝 Plan hazır (bölüm 6), uygulanmadı |
| `/hospitality` alt sayfası | 📝 Plan hazır (bölüm 7), uygulanmadı |

---

## 2. Projeler ve ortamlar

### kruv.com (bu repo)
- Repo: `kruv-design/kruv-portfolyo` → yerelde `~/Documents/GitHub/kruv-portfolyo`
- Stack: Next.js 15 App Router + React 19 + Supabase + Cloudinary + Tailwind, Vercel'de deploy.
- `main`'e push → Vercel otomatik deploy (1–2 dk sürer; hemen bakınca eski sürüm görünebilir).
- Dil: `/tr` ve `/en` → `src/app/[locale]/`. **Tüm metinler** `src/messages/tr.json` ve `en.json`.
- Stil: `public/home-figma.css` (ana sayfa), `src/app/globals.css` (token'lar).
  - Vurgu rengi: `--color-accent: #6366f1` (mor-mavi). **Turuncu değil.**
  - Yeni stil yazarken sadece mevcut token'ları kullan (`--space-*`, `--b1-*`, `--h1-*`, `--home-ink-muted` vb.).
- Projeler, showreel, Protel markaları/videoları: **Supabase'den gelir**, kodda değil → admin panelinden yönetilir.
- Yerel çalıştırma: `npm run dev` → `http://127.0.0.1:3000` (localhost'ta admin şifre istemez).

### kruvtest-test.online (test / dashboard sitesi)
- Ayrı bir Vercel deploy'u. Başlığı **"kruv.com — Site Panosu"**. Bu repodaki Next.js admin değil:
  `/admin` orada 404 veriyor.
- Açılışta şifre paneli var: "kruv / Bu sayfa şifre korumalıdır. / Şifre / Giriş".
  İçinde müşteri, gelir/gider gibi alanlar var (site denetim + finans panosu).
- **Aynı şifre sistemi:** `DASHBOARD_PASSWORD` env + `dashboard_access` çerezi
  (`src/lib/dashboard-auth.ts` yorumu: "kruvtest dashboard ile aynı çerez adı ve Vercel env").
- `package.json` → `test:e2e:live` Playwright'ı `PLAYWRIGHT_BASE_URL=https://kruvtest-test.online` ile çalıştırıyor.
- Not: Bu sitenin kaynak kodu bu repoda görünmüyor. Kruv.com'daki yeni çerez formatı kruvtest'i etkilemez
  (farklı domain, farklı çerez).

---

## 3. Yapılan değişiklikler (commit'lenmiş, canlıda)

### Hero (ana sayfa başlığı)
- `src/messages/tr.json` → `home.hero`
  - `line1`: "Paylaşmaya değer" (siyah)
  - `line2` / `mobileLine2`: "konaklama ve lezzet hikâyeleri." (mor vurgu)
  - **yeni** `subtitle`: "Otel ve restoranları strateji, fotoğraf, video ve sosyal medyayla anlatıyor, görünürlüğü rezervasyona dönüştürüyoruz."
- `src/messages/en.json` → `home.hero`
  - `line1`: "Hospitality & food stories", `line2`: "worth sharing."
  - `subtitle`: "We tell the stories of hotels and restaurants through strategy, photography, video and social media, and turn visibility into bookings."
- `src/components/public/MarketingHomeHeroHeadline.tsx`: h1 + alt metin `div.hero-v2-head__copy` içine alındı;
  `hero.subtitle` varsa `<p className="hero-v2-subtitle">` basılıyor.
- `public/home-figma.css`: `.hero-v2-head__copy` ve `.hero-v2-subtitle` eklendi (b1 tipografi, `--home-ink-muted`, max 60ch).
- Not: Başlıkta önce "gastronomi" vardı, mobilde çok uzun kaldığı için "lezzet" oldu.

---

## 4. Commit/push bekleyen değişiklikler (yerelde hazır)

Commit önerisi: `admin: kruvtest şifre paneli + güvenlik kapısı; müşteri video bölümü açıldı`

### 4a. Müşteri video bölümü tekrar açık
- `src/app/[locale]/page.tsx`: `MarketingHomeSocialClients` import'u ve bileşeni yorumdan çıkarıldı.
  Yeri: `MarketingHomeKayanYazi` sonrası, `MarketingHomeValues` öncesi.
- Veri: Supabase `protel_brands` (marka başına `video_1_url`, `video_2_url`, başlık, en-boy). Liste boşsa bölüm render olmaz.
- Başlık metni: `home.socialClients.tagLabel` = "AKTİF OLARAK YÖNETTİĞİMİZ SOSYAL MEDYA HESAPLARIMIZ".

### 4b. Admin şifre kapısı (kruvtest ile aynı)
**Kritik bulgu:** Kökteki `middleware.ts` Next tarafından **hiç çalıştırılmıyor** (proje `src/` yapısında;
middleware `src/middleware.ts` olmalı). Bu yüzden canlıda `kruv.com/admin` **herkese açıktı**
ve admin kayıtları `DASHBOARD_PASSWORD` olmadığı için 503 veriyordu.

Değişen / yeni dosyalar:
- **YENİ** `src/middleware.ts` — sadece `/admin`, `/admin/*`, `/login` için kapı.
  - localhost → kapı yok.
  - Çerez `dashboard_access` == şifreden türetilen token değilse → `/login?next=...`.
  - Girişliyken `/login` → `/admin`.
  - `DASHBOARD_PASSWORD` tanımlı değilse admin **kapalı kalır** (bilerek, fail-closed).
- **YENİ** `src/lib/dashboard-auth-edge.ts` — Edge (Web Crypto) token: `sha256("kruv-dashboard-v1:" + şifre)`.
- `src/lib/dashboard-auth.ts` — `dashboardSessionToken()` eklendi; `isDashboardCookieAuthed` artık sabit `"1"` yerine
  token'ı timing-safe karşılaştırıyor (eski "1" çerezi taklit edilebiliyordu).
- `src/app/api/unlock/route.ts` — doğru şifrede çereze token yazıyor.
- `src/app/login/LoginForm.tsx` — e-posta+şifre (Supabase) formu kaldırıldı; kruvtest gibi tek şifre paneli
  ("kruv." / "Bu sayfa şifre korumalıdır." / Şifre / Giriş) → `POST /api/unlock`.
- `src/app/login/actions.ts` — `loginAction` silindi; `logoutAction` artık `dashboard_access` çerezini siliyor → `/login`.
  (`loginSchema` `src/lib/validators.ts`'te kullanılmadan duruyor; silinebilir.)
- `src/app/api/settings/route.ts` — PATCH `supabaseServer()` → `supabaseAdmin()` (Supabase kullanıcı oturumu artık yok; `requireUser` korur).
- `src/app/admin/contact-inquiries/page.tsx` — okuma `supabaseAdmin()` ile (middleware kapısının arkasında).

Yerel test sonuçları (Host: kruv.com, `DASHBOARD_PASSWORD=test123`):
şifresiz /admin → 307 /login ✅ · sahte çerez "1" → 307 ✅ · yanlış şifre → 401 ✅ · doğru şifre → 200 + token çerezi ✅ ·
çerezle /admin → 200 ✅ · çerezle /login → /admin ✅ · sahte çerezle API yazma → 401 ✅ · /tr → 200 ✅ · localhost /admin → 200 ✅.
`tsc --noEmit` temiz. (Tam `next build` sandbox'ta Google Fonts erişimi olmadığı için denenemedi; Vercel'de sorun beklenmez.)

**Dokunulmayanlar (bilerek):**
- Kökteki `middleware.ts` ve `src/lib/supabase/middleware.ts` olduğu gibi bırakıldı (ölü kod).
  İçindeki locale yönlendirmesi de hiç çalışmıyor; `src/middleware.ts`'e taşımak davranış değiştirir — test etmeden yapma.

---

## 5. Açık işler / engeller

1. **Vercel → kruv.com projesi → Settings → Environment Variables → `DASHBOARD_PASSWORD`**
   (değer kruvtest projesindekiyle aynı) → ekle, sonra 4. bölümdeki commit'i push et.
   Sıra önemli: env yokken push edilirse admin kilitli kalır.
2. **GG Pizza videoları** (Protel → GG Pizza → Video 1 / Video 2):
   - Video 1: `https://res.cloudinary.com/di0qbhh46/video/upload/v1791970469/Sequence_01_1_rzrjzx.mp4`
   - Video 2: `https://res.cloudinary.com/di0qbhh46/video/upload/v1791970476/ggpizza_j25rrf.mp4`
   - Şu an eski değerler: `GG_6_rdirzm` ve `Food_is_art_yx3vep` (player.cloudinary.com embed linkleri).
   - Admin'de video alanı **sadece dosya yükleme** kabul ediyor, URL yapıştırma alanı yok.
     Seçenek: admin'e "Video URL" text input'u eklemek ya da Supabase'de `protel_brands` satırını
     (`slug = 'ggpizza'`) `video_1_url` / `video_2_url` olarak güncellemek.
   - Protel kaydı `PATCH /api/protel` tüm settings + brands'i birlikte gönderir.
3. Commit mesajları hep "up" — açıklayıcı yaz.

---

## 6. Ana sayfa hospitality planı (onaylanan yön, kalan maddeler)

Konum: **Otel ve restoranlar (konuk ağırlama) için sosyal medya ajansı** — strateji, foto/video çekim,
sosyal medya yönetimi, ManyChat, growth. SaaS/D2C ana sayfada pazarlanmıyor.

Bileşen sırası (`src/app/[locale]/page.tsx`): Nav → Hero → Spotlight → IdealClients → Featured → KayanYazi →
SocialClients → Values → Body.

| # | Bölüm / dosya | Öneri | Durum |
|---|---|---|---|
| 0 | `home.metaTitle` / `metaDescription` | "Otel ve Restoranlar için Sosyal Medya Ajansı \| Kruv" / "Otel ve restoranlar için strateji, çekim, sosyal medya yönetimi ve ManyChat. Çekimden rezervasyona." | yapılmadı |
| 1 | `MarketingSiteNav` | "Hospitality" linki; buton "Projeye başla" → "Ücretsiz analiz" | yapılmadı |
| 2 | Hero | — | ✅ |
| 3 | `home.spotlight` (Behance bölümü) | Etiket "OTEL & RESTORAN", başlık "Masadan feed'e, / feed'den masaya.", CTA "Hospitality'yi keşfet" → `/hospitality`; Behance rozetleri kalksın | yapılmadı |
| 4 | IdealClients (logolar, `public/partials` HTML) | Otel/restoran müşterileri öne (GG Pizza, Gezen, Mahalle…) | yapılmadı |
| 5 | Featured projeler | Admin'den otel/restoran projeleri öne | yapılmadı |
| 6 | `home.kayanYazi.phrases` | "Paylaşılmadıysa yaşanmamıştır" · "Bazı masalar dolar, bazıları paylaşılır" · "Yaşanmışsa paylaş" | yapılmadı |
| 7 | `home.values` ("Kime hitap ediyoruz?") | 01 Restoranlar · 02 Kafe ve barlar · 03 Butik oteller · 04 Resort ve beach'ler (her birine kısa dert+çözüm metni) | yapılmadı |
| 8 | `home.focus` ("Neredesin?") | "Mekanın nerede takılıyor?" → 01 Feed var rezervasyon yok · 02 İçerik/çekim yok · 03 DM'ler cevapsız (ManyChat) · 04 Hesabı yönetecek kimse yok | yapılmadı |
| 9 | `home.letsTalk` | "Masaların dolu mu?" + "Ücretsiz analiz al"; sayfada 4 kez tekrarlanıyor → 1–2'ye indir | yapılmadı |
| 10 | `shareMarquee`, `ticker`, `scrollMarquee` | "Paylaşmaya değer mekanlar tasarlıyoruz"; ticker: Restoran sosyal medyası · Otel sosyal medyası · Yemek ve mekan çekimi · ManyChat · Meta reklam · Growth · İstanbul | yapılmadı |
| 11 | `footer` hizmetler | Strateji · Çekim · Sosyal medya yönetimi · ManyChat ve growth · Marka kimliği (ambalaj/editoryal/illüstrasyon çıkar) | yapılmadı |

EN metinleri aynı tonda yazılmalı. Rakam iddiası eklenecekse gerçek müşteri verisiyle (uydurma rakam yok).

---

## 7. `/hospitality` alt sayfası planı

- Rota: `src/app/[locale]/hospitality/page.tsx` → `/tr/hospitality`, `/en/hospitality`; sitemap + meta + JSON-LD ekle.
- Kullanıcının masaüstü + mobil Figma tasarımı var — varsa ondan birebir kur; mevcut token/boşluk/renk kurallarının dışına çıkma.
- Bölümler: Problem ("Tanıdık geldi mi?") → Hizmetler (Strateji, Çekim, Sosyal medya yönetimi, ManyChat & growth) →
  Restoranlar / Oteller (iki sütun) → Süreç (Analiz → Strateji → Çekim → Yayın & test → Büyüme) →
  Test & sonuç ("A tuttu, B tutmadı") → ManyChat demo ("Yorum yaz MENÜ, menü DM'ine gelsin") →
  Paketler (Başlangıç / Büyüme / Partner, "…TL'den başlar") → SSS → Son CTA ("Masaların dolu mu?" → Ücretsiz analiz).

---

## 8. Instagram (bilgi amaçlı, kodla ilgisi yok)
- Bio (TR, seçilen yön): font/renk/tasarım içerikleri + "Otel ve restoranların feed'ini kuran ekipten."
- Kanal içeriği tasarımcılara yönelik (font, palet, karşılaştırma, mizah) ama otel/restoran açısıyla.
