# Görev: GA4 + Clarity canlı ziyaret verisi API'leri

Repo: portfolyo-cms (Next.js 15 App Router, Vercel'de kruv.com olarak deploy, TypeScript).
Amaç: Site denetim dashboard'unun ziyaret sekmesi 15 saniyede bir güncel veri çekebilsin.
GA4 Realtime API bunu destekler; Clarity Data Export API günde ~10 istekle sınırlıdır,
bu yüzden Clarity SADECE cache'lenmiş günlük özet olarak sunulacak — asla 15 sn polling yapma.

## 0) Ön kontrol — bunlar yapılmış olabilir, önce doğrula, yapılmışsa atla

- [ ] `src/app/api/ga-realtime/route.ts` var mı? (Bugün itibarıyla YOK.)
- [ ] `package.json`'da `@google-analytics/data` bağımlılığı var mı? (YOK.)
- [ ] `src/app/api/audit-summary/route.ts` içinde `format=text` desteği var mı?
      (Bugün eklendi ama DEPLOY EDİLMEMİŞ olabilir — yoksa dokunma, varsa commit'e dahil et.)
- [ ] `src/lib/env.ts` / `.env.local` içinde `GA_PROPERTY_ID`, `GA_SA_KEY`, `CLARITY_API_TOKEN` tanımlı mı?
- [ ] Client tarafı gtag (`src/components/analytics/Analytics.tsx`, `src/lib/analytics/ga4.ts`) ve
      Clarity script'i kurulu — bunlara DOKUNMA, sadece server-side veri okuma ekleniyor.

Kullanıcıya sorulacaklar (env değerleri sende yoksa):
- GA4 sayısal Property ID (Measurement ID `G-0L9EFB2YHV` DEĞİL; Admin → Property Settings'teki numara)
- GA service account JSON key (kullanıcı GCP'de oluşturup GA property'ye Viewer olarak ekleyecek)
- Clarity Data Export API token (Clarity → Settings → Data Export)

## 1) `/api/ga-realtime` route'u

- `npm i @google-analytics/data`
- Yeni dosya: `src/app/api/ga-realtime/route.ts`, `export const runtime = "nodejs"`.
- Auth: `?token=` query param'ı `process.env.AUDIT_SUMMARY_TOKEN` ile karşılaştır
  (mevcut `src/app/api/audit-summary/route.ts` ile aynı desen: token yoksa 500, uyuşmazsa 401).
- Env: `GA_PROPERTY_ID`, `GA_SA_KEY` (JSON string; parse ederken `private_key` içindeki
  `\\n` kaçışlarını gerçek newline'a çevir).
- `BetaAnalyticsDataClient` ile iki sorgu:
  a. `runRealtimeReport`: metrics `activeUsers`, dimension `unifiedScreenName` (sayfa bazlı anlık aktifler)
  b. `runReport`: son 30 gün, metrics `activeUsers`,`screenPageViews`, dimension `date` (günlük seri)
- Yanıt şekli (audit-summary ile uyumlu):
  `{ generated_at, error: null, realtime: { active_users, by_page: [{page, count}] }, summary: { by_day: [{date, active_users, page_views}] } }`
- Cache: modül seviyesi in-memory `{ data, fetchedAt }` — 15 sn'den tazeyse GA'ya gitme, cache'i dön.
  Ek olarak `Cache-Control: private, max-age=10` header'ı.
- `?format=text` param'ı varsa aynı JSON'u `content-type: text/plain; charset=utf-8` ile dön
  (audit-summary'deki desenle aynı — dış fetch araçları application/json'ı gösteremiyor).
- CORS: GET için `Access-Control-Allow-Origin: *` header'ı ekle (dashboard farklı origin'den poll edecek);
  OPTIONS handler ekle.

## 2) `/api/clarity-summary` route'u

- Yeni dosya: `src/app/api/clarity-summary/route.ts`, nodejs runtime, aynı token auth + format=text + CORS.
- Env: `CLARITY_API_TOKEN`.
- Upstream: `GET https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1`
  header `Authorization: Bearer <CLARITY_API_TOKEN>`.
- KRİTİK: günde ~10 istek limiti var. Yanıtı 3 SAAT cache'le — in-memory cache yeterli değil
  (serverless cold start), kalıcı cache olarak Supabase'te tek satırlık bir tablo kullan:
  `clarity_cache (id int primary key default 1, payload jsonb, fetched_at timestamptz)`.
  Migration ekle (`supabase/migrations/`). `fetched_at` 3 saatten tazeyse Clarity'ye HİÇ gitme.
- Upstream 4xx/5xx dönerse cache'teki son payload'ı `stale: true` işaretiyle dön.

## 3) Env & dokümantasyon

- `.env.example`'a (yoksa oluştur) `GA_PROPERTY_ID=`, `GA_SA_KEY=`, `CLARITY_API_TOKEN=` ekle.
- README'ye kısa kurulum notu: GCP service account oluşturma → GA4 property'ye Viewer ekleme →
  key'i Vercel env'e `GA_SA_KEY` olarak yapıştırma; Clarity token alma.
- Secrets'ı asla `NEXT_PUBLIC_` yapma, `vercel.json`'a yazma, client bundle'a sızdırma.

## 4) Kabul kriterleri

- `curl "https://kruv.com/api/ga-realtime?token=<AUDIT_SUMMARY_TOKEN>&format=text"` →
  200, text/plain, yukarıdaki şemada JSON; 15 sn içinde ikinci istek GA API'ye gitmez (log ile doğrula).
- `curl "https://kruv.com/api/clarity-summary?token=...&format=text"` → 200; art arda istekler
  Clarity'ye tek istek atar (3 saat cache).
- Yanlış token → 401 `{"error":"unauthorized"}`; token env'de yoksa → 500 açıklayıcı mesaj.
- `npm run build` temiz geçer; mevcut route'lar ve client analytics bozulmaz.

## Kapsam dışı (başka yerde yapılacak)

- Dashboard HTML'ine 15 sn'lik polling eklenmesi (`ogrenme/kruv-website/site-audit/generate_dashboard.py`)
  ayrı bir araç tarafından yapılacak — bu repo'da dashboard işi yapma.
