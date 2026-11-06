# Bilgisayar Teknik Servisi – Kurumsal Web Sitesi (Proje Dokümantasyonu)

> Bu doküman, siteyi sıfırdan inşa edecek geliştirici/yapay zekâ ajanı için **tek kaynak (single source of truth)** olarak hazırlanmıştır. Burada yazan her şey uygulanmalıdır. Belirsiz kalan bir nokta olursa "Varsayımlar ve Placeholder'lar" bölümüne bakın; orada yazan varsayılanı kullanın ve soru sormadan ilerleyin.

---

## 1. Proje Özeti

| Başlık | Değer |
| --- | --- |
| Proje türü | Bilgisayar teknik servisi için kurumsal tanıtım web sitesi |
| Hedef kitle | Bireysel müşteriler ve şirketler (B2C + B2B) |
| Diller | Türkçe (varsayılan) ve İngilizce |
| Tasarım yönü | Kurumsal, güven veren; mavi/gri tonlar, düzenli yerleşim, bol boşluk |
| Temalar | Aydınlık ve karanlık tema (kullanıcı seçimi + sistem tercihi) |
| Ana hedef | Ziyaretçiyi **servis talebi oluşturmaya**, **aramaya** veya **WhatsApp'tan yazmaya** yönlendirmek |
| İkincil hedefler | Güven oluşturmak (referanslar, ekip, rakamlar), yerel SEO'da üst sıralara çıkmak, blog ile organik trafik çekmek |

### 1.1 Başarı Kriterleri
- Lighthouse (mobil) skorları: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Tüm sayfalar 360px – 1920px arası bozulmadan çalışır (mobil öncelikli).
- Servis talebi formu uçtan uca çalışır (doğrulama, gönderim, başarı/hata durumu).
- Cihaz durumu sorgulama demo verilerle çalışır.
- TR/EN geçişi tüm sayfalarda eksiksizdir; çevrilmemiş metin kalmaz.
- Klavye ile tüm site gezilebilir; WCAG 2.2 AA uyumludur.

---

## 2. Teknoloji Yığını

| Katman | Seçim | Not |
| --- | --- | --- |
| Framework | **Next.js 14+ (App Router)** | SSR/SSG, SEO, API route'ları |
| Dil | **TypeScript** (strict mode) | `any` kullanımından kaçının |
| Stil | **Tailwind CSS** + CSS değişkenleri (design tokens) | Tema geçişi için `class` stratejisi |
| UI bileşenleri | Kendi bileşenleri; gerekirse **Radix UI** primitives (Accordion, Dialog, Tabs, Select) | Erişilebilirlik için |
| İkonlar | **lucide-react** | |
| Çoklu dil | **next-intl** | `/tr/...` ve `/en/...` rotaları |
| Tema | **next-themes** | `light`, `dark`, `system` |
| Form | **react-hook-form** + **zod** | Aynı zod şeması sunucuda da doğrulama için kullanılır |
| Blog | **MDX** (`next-mdx-remote` veya `@next/mdx`) + `gray-matter` | İçerik dosya tabanlı |
| Harita | Google Maps **iframe embed** (API anahtarı gerektirmeyen) | Lazy-load |
| Animasyon | **CSS transitions** + isteğe bağlı **framer-motion** (hafif kullanım) | `prefers-reduced-motion` saygı gösterilmeli |
| E-posta | **Resend** (varsayılan) veya SMTP (nodemailer) | Ortam değişkeni yoksa konsola log'la |
| Paket yöneticisi | `npm` | |
| Lint/format | ESLint + Prettier | |
| Yayın | Vercel (önerilen) | |

> Veritabanı **yoktur**. Cihaz sorgulama verisi `data/repairs.json` dosyasındadır; ileride veritabanına taşınabilecek şekilde bir **repository katmanı** (`lib/repairs.ts`) arkasına saklanmalıdır.

### 2.1 Zorunlu Claude Code Skill'leri (Arayüz Kalitesi)

Arayüzün profesyonel ve kaliteli olması için, siteyi inşa eden yapay zekâ ajanı (Claude Code) aşağıdaki iki skill'i **kodlamaya başlamadan önce** proje köküne kurmalı ve tüm arayüz çalışmalarında kullanmalıdır:

```bash
npx claude-code-templates@latest --skill creative-design/frontend-design
npx claude-code-templates@latest --skill development/senior-frontend
```

| Skill | Ne zaman kullanılır |
| --- | --- |
| `frontend-design` | Sayfa ve bölüm tasarımı, görsel hiyerarşi, tipografi, renk kullanımı, boşluk, mikro etkileşimler, hero/illüstrasyon, kart ve bileşen görünümü |
| `senior-frontend` | Bileşen mimarisi, React/Next.js en iyi pratikleri, performans, erişilebilirlik, durum yönetimi, kod kalitesi ve yeniden kullanılabilirlik |

**Kurallar:**
- Kurulumdan sonra skill'lerin yüklendiği doğrulanır (`.claude/skills/` altında görünmeli).
- Her sayfa/bölüm (Bölüm 6–9) yazılmadan önce `frontend-design` skill'i, her bileşen/mimari karar öncesinde `senior-frontend` skill'i çağrılır.
- Skill önerileri **bu dokümandaki tasarım sistemiyle (Bölüm 5) çelişirse bu doküman önceliklidir**: kurumsal, güven veren mavi/gri kimlik, belirlenen renk token'ları, Inter fontu ve abartısız efektler korunur. Skill'ler bu çerçeve içinde kaliteyi artırmak için kullanılır (ör. daha rafine boşluk/hiyerarşi, özenli hover/odak durumları, tutarlı ikon kullanımı, şablon görünümünden kaçınma).
- Faz 8 (Cila ve kalite) sırasında tüm sayfalar her iki skill'in kontrol listeleriyle yeniden gözden geçirilir.

---

## 3. Proje Yapısı

```
/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                      # Ana sayfa
│  │  ├─ hakkimizda/page.tsx           # (EN: /about)
│  │  ├─ hizmetler/
│  │  │  ├─ page.tsx                   # Hizmet listesi + fiyat tablosu
│  │  │  └─ [slug]/page.tsx            # Hizmet detay
│  │  ├─ ekip-ve-referanslar/page.tsx  # (EN: /team-and-references)
│  │  ├─ blog/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx
│  │  ├─ sss/page.tsx                  # (EN: /faq)
│  │  ├─ servis-talebi/page.tsx        # (EN: /service-request)
│  │  ├─ cihaz-sorgula/page.tsx        # (EN: /track-device)
│  │  ├─ iletisim/page.tsx             # (EN: /contact)
│  │  └─ not-found.tsx
│  ├─ api/
│  │  ├─ service-request/route.ts      # POST
│  │  ├─ contact/route.ts              # POST
│  │  └─ repair-status/route.ts        # GET ?code=
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ manifest.ts
├─ components/
│  ├─ layout/ (Header, Footer, MobileMenu, LanguageSwitcher, ThemeToggle, FloatingContact)
│  ├─ sections/ (Hero, TrustStats, ServicesGrid, ProcessSteps, WhyUs, TestimonialsCarousel, ClientLogos, CTABanner, FAQAccordion, TeamGrid, PriceTable, BlogPreview)
│  ├─ forms/ (ServiceRequestForm, ContactForm, TrackingForm)
│  └─ ui/ (Button, Card, Badge, Input, Select, Textarea, Checkbox, Accordion, Toast, Skeleton, Breadcrumb)
├─ content/
│  ├─ blog/tr/*.mdx
│  └─ blog/en/*.mdx
├─ data/
│  ├─ services.ts                      # Hizmet verisi (TR/EN)
│  ├─ team.ts
│  ├─ testimonials.ts
│  ├─ clients.ts
│  ├─ faq.ts
│  └─ repairs.json                     # Demo cihaz kayıtları
├─ lib/
│  ├─ site-config.ts                   # Şirket bilgileri (tek yerden yönetilir)
│  ├─ repairs.ts                       # Repository katmanı
│  ├─ blog.ts                          # MDX okuma yardımcıları
│  ├─ validation.ts                    # zod şemaları
│  ├─ rate-limit.ts                    # Basit bellek içi rate limit
│  └─ seo.ts                           # Metadata + JSON-LD yardımcıları
├─ messages/
│  ├─ tr.json
│  └─ en.json
├─ public/ (logo.svg, og-image.png, favicon, partner logoları, görseller)
├─ i18n/ (routing.ts, request.ts)
├─ middleware.ts                       # Dil yönlendirmesi
├─ tailwind.config.ts
├─ .env.example
└─ README.md
```

---

## 4. Çoklu Dil (i18n)

- Kütüphane: `next-intl`. Desteklenen diller: `tr` (varsayılan), `en`.
- URL yapısı: `/tr/...` ve `/en/...`. Kök `/` isteği tarayıcı diline göre yönlendirilir, bulunamazsa `tr`.
- **Yerelleştirilmiş rota adları** kullanılır (aşağıdaki tablo). `i18n/routing.ts` içinde `pathnames` ile tanımlanır.
- Tüm UI metinleri `messages/tr.json` ve `messages/en.json` dosyalarında tutulur; bileşenlerde sabit metin bulunmamalıdır.
- Hizmet, ekip, SSS ve referans verileri iki dilli alanlar içerir (`{ tr: string; en: string }`).
- Blog yazıları dile göre ayrı MDX dosyalarıdır; aynı `slug` + `translationKey` ile eşleşir.
- Header'daki **dil değiştirici**, kullanıcıyı mevcut sayfanın karşılığına götürür (mümkünse aynı yazı/hizmet).
- Her sayfada `<link rel="alternate" hreflang>` etiketleri ve `x-default` bulunur.
- Tarih, para birimi ve sayı biçimleri `Intl` ile dile göre biçimlendirilir (TR: `1.250 ₺`, EN: `₺1,250`).

| Sayfa | TR yolu | EN yolu |
| --- | --- | --- |
| Ana sayfa | `/tr` | `/en` |
| Hakkımızda | `/tr/hakkimizda` | `/en/about` |
| Hizmetler | `/tr/hizmetler` | `/en/services` |
| Hizmet detay | `/tr/hizmetler/[slug]` | `/en/services/[slug]` |
| Ekip ve Referanslar | `/tr/ekip-ve-referanslar` | `/en/team-and-references` |
| Blog | `/tr/blog` | `/en/blog` |
| Blog yazısı | `/tr/blog/[slug]` | `/en/blog/[slug]` |
| SSS | `/tr/sss` | `/en/faq` |
| Servis Talebi | `/tr/servis-talebi` | `/en/service-request` |
| Cihaz Sorgula | `/tr/cihaz-sorgula` | `/en/track-device` |
| İletişim | `/tr/iletisim` | `/en/contact` |

---

## 5. Tasarım Sistemi

### 5.1 Genel İlke
Kurumsal, sakin ve güven veren bir görünüm. Bol boşluk, net hiyerarşi, tutarlı köşe yuvarlaklığı, abartısız gölge. Süslü efektlerden kaçının; içerik ve eylem butonları öne çıkmalı.

### 5.2 Renk Paleti (Design Tokens)
Tüm renkler CSS değişkeni olarak `globals.css` içinde tanımlanır ve Tailwind'e bağlanır.

**Aydınlık tema**

| Token | Değer | Kullanım |
| --- | --- | --- |
| `--background` | `#FFFFFF` | Sayfa zemini |
| `--surface` | `#F5F7FA` | Alternatif bölüm zemini |
| `--card` | `#FFFFFF` | Kart zemini |
| `--border` | `#E2E8F0` | Kenarlıklar |
| `--foreground` | `#0F172A` | Ana metin |
| `--muted` | `#475569` | İkincil metin |
| `--primary` | `#1D5FD1` | Ana marka rengi, butonlar, linkler |
| `--primary-hover` | `#174DAA` | Hover |
| `--primary-foreground` | `#FFFFFF` | Primary üzerindeki metin |
| `--navy` | `#0F2747` | Koyu bölümler, footer |
| `--accent` | `#0EA5E9` | Vurgu, ikonlar, rozetler |
| `--success` | `#16A34A` | Başarı |
| `--warning` | `#D97706` | Uyarı |
| `--danger` | `#DC2626` | Hata |

**Karanlık tema**

| Token | Değer |
| --- | --- |
| `--background` | `#0B1220` |
| `--surface` | `#101A2E` |
| `--card` | `#13203A` |
| `--border` | `#24324F` |
| `--foreground` | `#E6ECF5` |
| `--muted` | `#9AA9C2` |
| `--primary` | `#4C8DF6` |
| `--primary-hover` | `#6AA0F8` |
| `--primary-foreground` | `#0B1220` |
| `--navy` | `#0A1426` |
| `--accent` | `#38BDF8` |

> Metin/arka plan kontrastı her iki temada en az **4.5:1** olmalıdır (büyük metinde 3:1).

### 5.3 Tipografi
- Font: **Inter** (`next/font/google`, `display: swap`, `latin` + `latin-ext` — Türkçe karakterler için `latin-ext` zorunlu).
- Ölçek (mobil → masaüstü): H1 `2.25rem → 3.5rem` · H2 `1.75rem → 2.5rem` · H3 `1.25rem → 1.5rem` · gövde `1rem` (satır yüksekliği 1.65) · küçük `0.875rem`.
- Başlık ağırlığı 700, gövde 400, buton/etiket 600.

### 5.4 Boşluk, Şekil ve Yerleşim
- Kapsayıcı: `max-width: 1200px`, yan boşluk mobilde 16px, masaüstünde 24px.
- Bölüm dikey boşluğu: mobilde `64px`, masaüstünde `96px`.
- Köşe yuvarlaklığı: kartlar `12px`, butonlar/inputlar `8px`, rozetler tam yuvarlak.
- Gölge: yalnızca kartlarda hafif (`0 1px 3px rgba(15,39,71,.08)`); hover'da bir kademe artar.
- Grid: 12 kolon; kart ızgaraları mobilde 1, tablette 2, masaüstünde 3–4 kolon.

### 5.5 Logo
Görsel logo yoktur. `components/layout/Logo.tsx` içinde **metin tabanlı logo**: sol tarafta mavi, yuvarlatılmış kare içinde basit bir `lucide` ikonu (`Cpu` veya `Wrench`), yanında şirket adı (kalın) ve altında küçük slogan. Şirket adı `site-config.ts` içinden gelir. Ayrıca `public/logo.svg` dosyası aynı tasarımla üretilmelidir (favicon ve OG görseli için).

### 5.6 Bileşen Davranışları
- **Button:** `primary`, `secondary` (kenarlıklı), `ghost`, `whatsapp` (yeşil `#25D366`) varyantları; boyutlar `sm/md/lg`; `loading` durumunda spinner ve `aria-busy`.
- **Input/Select/Textarea:** Görünür `<label>`, hata mesajı `aria-describedby` ile bağlı, hata durumunda kırmızı kenarlık + ikon (renge tek başına güvenme).
- **Odak halkası:** Tüm etkileşimli öğelerde 2px `--primary` + 2px offset; kaldırılmaz.
- **Toast:** Form sonuçları için sağ alt köşe, `role="status"`.
- **Skeleton:** Yüklenme durumları için.
- **Animasyon:** Görünürlüğe girince hafif fade/slide (≤ 300ms). `prefers-reduced-motion: reduce` durumunda tüm animasyonlar kapatılır.

---

## 6. Global Bileşenler

### 6.1 Header
- Sol: Logo. Orta: ana menü. Sağ: **dil değiştirici (TR | EN)**, **tema anahtarı (güneş/ay/sistem)**, **"Servis Talebi" birincil butonu**.
- Menü öğeleri: Ana Sayfa, Hizmetler, Hakkımızda, Ekip ve Referanslar, Blog, SSS, İletişim. "Cihaz Sorgula" ikincil bağlantı olarak menüde veya "Servis Talebi" yanında bulunur.
- Yapışkan (sticky); aşağı kaydırınca hafif gölge ve yarı saydam arka plan.
- Mobilde hamburger menü: tam ekran panel, odak tuzağı (focus trap), `Esc` ile kapanır, açıkken gövde kaydırması kilitlenir.
- En üstte ince bir **bilgi çubuğu**: telefon numarası, çalışma saatleri, e-posta (mobilde yalnızca telefon).
- "İçeriğe geç" (skip to content) bağlantısı ilk odaklanan öğedir.
- Aktif sayfa `aria-current="page"` ile işaretlenir.

### 6.2 Footer
- Koyu lacivert (`--navy`) zemin. 4 kolon: (1) Logo + kısa tanıtım + sosyal medya ikonları, (2) Hızlı bağlantılar, (3) Hizmetler (ilk 6), (4) İletişim (adres, telefon, e-posta, çalışma saatleri).
- En altta: telif satırı (`© {yıl} {şirket adı}`), Gizlilik Politikası ve KVKK Aydınlatma Metni bağlantıları (basit placeholder sayfalar: `/tr/gizlilik`, `/tr/kvkk` ve EN karşılıkları).

### 6.3 Sabit İletişim Butonu (FloatingContact)
- Sağ alt köşede sabit. Mobilde **WhatsApp** (yeşil) ve **Ara** butonları; masaüstünde yalnızca WhatsApp.
- WhatsApp bağlantısı: `https://wa.me/{numara}?text={önceden_doldurulmuş_mesaj}` (mesaj dile göre değişir).
- Telefon: `tel:` bağlantısı. Her butonun `aria-label` değeri vardır.
- Form sayfalarında buton, gönder butonunu kapatmayacak şekilde konumlanır.

### 6.4 Çerez/KVKK Bildirimi
Hafif bir alt şerit: "Zorunlu çerezler kullanıyoruz." Kabul edilince `localStorage`'a kaydedilir. Analitik eklenmeyecekse yalnızca bilgilendirme amaçlıdır.

---

## 7. Sayfa Detayları

### 7.1 Ana Sayfa
Bölümler yukarıdan aşağıya:

1. **Hero:** Büyük başlık (ör. "Bilgisayarınız aynı gün, garantili çözüm"), alt metin, iki buton ("Servis Talebi Oluştur" birincil, "Hemen Ara" ikincil), yanında soyut/illüstratif bir görsel (SVG; stok fotoğraf yoksa CSS/SVG ile üretilmiş bilgisayar/çip illüstrasyonu). Altında 3 kısa güven maddesi (ör. "Ücretsiz arıza tespiti", "6 ay garanti", "Aynı gün teslim").
2. **Güven Rakamları (TrustStats):** 4 sayaç — kuruluş yılından hesaplanan tecrübe yılı, onarılan cihaz sayısı, memnuniyet oranı, ortalama onarım süresi. Görünüre girince sayarak artar (reduced-motion'da doğrudan sonuç).
3. **Hizmetler Izgarası:** 8 hizmetin kartı (ikon, başlık, 1–2 cümle, "Detaylar" bağlantısı). "Tüm hizmetleri gör" butonu.
4. **Nasıl Çalışır (ProcessSteps):** 4 adım — 1) Talep oluştur / ara, 2) Ücretsiz arıza tespiti, 3) Onay ve onarım, 4) Teslim ve garanti. Adım numaraları ve ikonlarla yatay (mobilde dikey) akış.
5. **Neden Biz (WhyUs):** 6 maddelik özellik kartı (Orijinal/uyumlu parça, Şeffaf fiyat, Veri gizliliği, Hızlı teslim, Garanti, Kurumsal destek).
6. **Referanslar (TestimonialsCarousel):** 3–5 müşteri yorumu; ok tuşları ve noktalarla gezilir, otomatik oynatma yoktur (erişilebilirlik).
7. **Müşteri Logoları (ClientLogos):** Gri tonlu logo şeridi (placeholder metin-logolar).
8. **Cihaz Sorgula Kısa Kutusu:** Tek satırlık takip kodu girişi → `/cihaz-sorgula?code=...` sayfasına yönlendirir.
9. **Blog Önizleme:** Son 3 yazı kartı.
10. **CTA Bandı:** Koyu mavi zemin; "Cihazınızda sorun mu var?" + Servis Talebi + WhatsApp butonları.

### 7.2 Hakkımızda
- Sayfa başlığı + breadcrumb.
- **Şirket hikayesi:** 2–3 paragraf (kuruluş yılı, yaklaşım).
- **Misyon / Vizyon / Değerler:** 3 kart.
- **Rakamlarla biz:** TrustStats tekrar kullanımı.
- **Çalışma prensipleri / sertifikalar:** 4–6 maddelik liste (placeholder: "Yetkili servis deneyimi", "ESD korumalı çalışma alanı" vb.).
- **Atölye/ofis bölümü:** Görsel alanı (placeholder görsel) + kısa metin.
- Altta CTA bandı.

### 7.3 Hizmetler (Liste Sayfası)
- Üstte kısa tanıtım ve **kategori filtresi** (Tümü / Bireysel / Kurumsal) — her hizmetin `audience` alanına göre.
- Kart ızgarası (8 hizmet), her kart detay sayfasına gider.
- **Fiyat Tablosu (PriceTable):** Hizmet bazlı başlangıç fiyatları. Sütunlar: Hizmet · Başlangıç Fiyatı · Tahmini Süre · Not. Altında uyarı metni: *"Fiyatlar başlangıç fiyatıdır; kesin ücret arıza tespitinden sonra bildirilir."* Mobilde tablo kartlar listesine dönüşür (yatay kaydırma yerine).
- Altta CTA bandı.

### 7.4 Hizmet Detay (`/hizmetler/[slug]`)
`generateStaticParams` ile statik üretilir. Bölümler:
1. Başlık, ikon, kısa özet, breadcrumb, "Servis Talebi Oluştur" butonu.
2. **Hangi sorunlarda?** — maddeli liste (belirtiler).
3. **Ne yapıyoruz?** — süreç adımları.
4. **Fiyat ve süre kutusu:** başlangıç fiyatı, tahmini süre, garanti süresi.
5. **Sık sorulan sorular:** bu hizmete özel 3–4 soru (Accordion) — `FAQPage` JSON-LD ile.
6. **İlgili hizmetler:** 3 kart.
7. CTA bandı.
- Her hizmetin kendine özgü `title`, `description` ve OG görseli bulunur.

### 7.5 Ekip ve Referanslar
- **Ekip:** 4–6 kişilik kart ızgarası (fotoğraf yerine baş harfli avatar, ad, unvan, uzmanlık etiketleri, kısa bio). Fotoğraf eklenirse `next/image` ile.
- **Müşteri yorumları:** Tüm yorumların listesi (ad, rol/şirket, yıldız puanı 1–5, metin).
- **Müşteri logoları:** Tam ızgara.
- **Vaka/örnek çalışma (opsiyonel kısa kart):** 2 örnek ("Bir muhasebe ofisinin 12 bilgisayarı 2 günde yenilendi" vb.).

### 7.6 Blog
- **Liste sayfası:** Kart ızgarası (kapak görseli, kategori rozeti, başlık, özet, tarih, okuma süresi). **Kategori filtresi** ve **arama kutusu** (istemci tarafı, başlık+özet üzerinde). Sayfalama: sayfa başına 9 yazı.
- **Yazı sayfası:** Başlık, tarih, yazar, okuma süresi, kapak görseli, MDX içerik (başlık, liste, kod bloğu, görsel, uyarı kutusu bileşenleri), içindekiler listesi (h2/h3'ten otomatik), paylaş bağlantıları, ilgili yazılar (aynı kategoriden 3), yazı sonu CTA'sı.
- `Article` JSON-LD eklenir.
- **Başlangıç içerikleri (her dilde en az 4 yazı):**
  1. Bilgisayarım neden yavaşladı? 7 pratik çözüm
  2. Laptop bataryası şişerse ne yapmalı?
  3. Veri kaybı yaşadıysanız ilk 5 dakikada yapmanız gerekenler
  4. SSD'ye geçmek gerçekten fark yaratır mı?
  5. (Opsiyonel) Şirketler için periyodik bilgisayar bakımı rehberi
- **MDX frontmatter şeması:**
```yaml
title: string
slug: string
translationKey: string        # TR/EN eşleşmesi için
description: string           # meta description, ≤160 karakter
date: YYYY-MM-DD
updated: YYYY-MM-DD           # opsiyonel
author: string
category: string
tags: [string]
cover: /images/blog/xxx.jpg   # yoksa üretilmiş gradient kapak
readingTime: number           # dakika, yoksa otomatik hesapla
published: true
```

### 7.7 SSS
- Kategori sekmeleri: Genel · Fiyat ve Ödeme · Süre ve Garanti · Veri ve Gizlilik · Kurumsal.
- Her kategori için 4–6 soru; **Accordion** (tek seferde bir veya birden fazla açık, `aria-expanded`).
- Sayfa içi arama kutusu (sorularda filtreler).
- Sayfanın sonunda "Cevabı bulamadınız mı?" kutusu → İletişim ve WhatsApp.
- `FAQPage` JSON-LD.

### 7.8 Servis Talebi / Randevu
Ayrı sayfa; header'daki birincil buton ve CTA'lar buraya gider. Ayrıntılar için **Bölüm 8**.

### 7.9 Cihaz Durumu Sorgulama
Ayrı sayfa. Ayrıntılar için **Bölüm 9**.

### 7.10 İletişim
- İki kolon: solda **iletişim formu**, sağda iletişim kartları (adres, telefon, WhatsApp, e-posta, çalışma saatleri) ve sosyal medya.
- Altta tam genişlikte **Google Harita** gömülü iframe (`loading="lazy"`, `title` verilmiş). Harita altında "Yol tarifi al" butonu (Google Maps linki).
- Çalışma saatleri tablosu; bugünün satırı vurgulanır.
- İletişim formu alanları: Ad Soyad, E-posta, Telefon (opsiyonel), Konu (select: Genel / Fiyat bilgisi / Kurumsal teklif / Diğer), Mesaj, KVKK onay kutusu. Doğrulama ve gönderim kuralları **Bölüm 8.4**'teki gibi.

---

## 8. Servis Talebi / Randevu Formu

### 8.1 Alanlar

| Alan | Tür | Zorunlu | Kurallar |
| --- | --- | --- | --- |
| `fullName` | text | Evet | 2–80 karakter |
| `phone` | tel | Evet | TR cep formatı (`05XX XXX XX XX`) veya uluslararası; boşluklar temizlenir |
| `email` | email | Hayır | Girilirse geçerli e-posta |
| `customerType` | radio | Evet | `individual` / `company` |
| `companyName` | text | Şirketse evet | 2–100 karakter |
| `deviceType` | select | Evet | Laptop · Masaüstü · All-in-One · Tablet · Sunucu/Ağ cihazı · Diğer |
| `brand` | text/combobox | Evet | Öneri listesi: Apple, ASUS, Acer, Casper, Dell, HP, Huawei, Lenovo, MSI, Monster, Samsung, Toshiba, Diğer |
| `model` | text | Hayır | ≤ 80 karakter |
| `serviceType` | select | Evet | Hizmet listesinden (ilgili hizmet sayfasından gelindiyse önceden seçili) |
| `issue` | textarea | Evet | 20–1000 karakter, canlı karakter sayacı |
| `urgency` | radio | Evet | `normal` / `urgent` (aynı gün) |
| `deliveryMethod` | radio | Evet | `dropoff` (getireceğim) / `pickup` (adresten alın) |
| `address` | textarea | `pickup` ise evet | 10–250 karakter |
| `preferredDate` | date | Evet | Bugünden itibaren 30 gün içinde; geçmiş tarih seçilemez; **pazar kapalı** (uyarı göster) |
| `preferredTime` | select | Evet | 09:00–12:00 · 12:00–15:00 · 15:00–18:30 aralıkları |
| `backupConsent` | checkbox | Hayır | "Verilerim yedeklenmeden işlem yapılabilir/yapılamaz" bilgilendirme seçimi |
| `kvkkConsent` | checkbox | Evet | KVKK aydınlatma metnini okudum |
| `website` | text | — | **Honeypot** (gizli); doluysa istek sessizce reddedilir |

### 8.2 Davranış
- Çok adımlı değil, **tek sayfalık form**, ancak bölümlere ayrılmış başlıklarla: *Kişi Bilgileri → Cihaz Bilgileri → Sorun → Teslim ve Randevu → Onay*.
- Koşullu alanlar (şirket adı, adres) ilgili seçimde animasyonsuz görünür/gizlenir; gizlenen alan doğrulamadan çıkar.
- Doğrulama: `react-hook-form` + `zod`; alan terk edildiğinde (onBlur) ve gönderimde; ilk hatalı alana odaklanır; hata özeti formun üstünde `role="alert"`.
- Gönderim sırasında buton `loading` olur, çift gönderim engellenir.
- **Başarı durumu:** Form yerine başarı kartı gösterilir — **takip kodu** (ör. `TS-2026-48213`), özet bilgiler, "Takip kodunuzu kaydedin", "Cihaz durumunu sorgula" ve "Ana sayfaya dön" butonları. Kod panoya kopyalanabilir.
- Hata durumunda form verisi korunur ve toast ile hata gösterilir.
- Sayfa yanında **bilgi kartı**: "Ne olacak?" adımları, çalışma saatleri, acil durumda telefon numarası.

### 8.3 API: `POST /api/service-request`
- Girdi aynı `zod` şemasıyla sunucuda yeniden doğrulanır.
- Başarılı yanıt: `201 { ok: true, trackingCode: "TS-2026-48213" }`.
- Hatalı girdi: `422 { ok: false, errors: { alan: "mesaj" } }`.
- Rate limit aşıldı: `429`. Sunucu hatası: `500`.
- Takip kodu formatı: `TS-{YIL}-{5 haneli rastgele sayı}`.
- Bildirim: `NOTIFY_EMAIL_TO` adresine e-posta (HTML + düz metin). `RESEND_API_KEY` tanımlı değilse içerik **konsola log'lanır** ve yanıt yine başarılı döner (geliştirme modu).
- Müşteri `email` girdiyse ona da onay e-postası gönderilir (takip kodunu içerir).

### 8.4 Spam ve Güvenlik (tüm formlar için)
- Honeypot alanı + minimum doldurma süresi kontrolü (< 3 sn ise reddet).
- IP başına rate limit: 5 istek / 10 dakika (bellek içi; üretimde Upstash/Redis'e geçilebilecek arayüz).
- Girdi temizleme (HTML etiketlerini sil), e-posta şablonlarında kaçış (escape).
- Hassas bilgi log'lanmaz (telefon/e-posta konsola maskelenmiş yazılır).

---

## 9. Cihaz Durumu Sorgulama

### 9.1 Sayfa
- Tek alanlı form: **Takip Kodu** (`TS-2026-48213` formatı, büyük/küçük harf duyarsız, boşluklar kırpılır). İsteğe bağlı olarak telefonun **son 4 hanesi** ikinci doğrulama alanı olarak istenir (gizlilik için).
- URL'de `?code=` varsa alan dolu gelir ve otomatik sorgulanır.
- Sonuç görünümü:
  - Üstte cihaz bilgisi (marka, model, cihaz türü), teslim alma tarihi, tahmini teslim tarihi.
  - **Durum zaman çizelgesi (stepper):** Teslim Alındı → Arıza Tespiti → Onay Bekliyor → Onarımda → Test → Teslime Hazır → Teslim Edildi. Geçmiş adımlar tamamlanmış, mevcut adım vurgulu, gelecek adımlar soluk.
  - Durum geçmişi listesi (tarih/saat + not).
  - Tahmini ücret (varsa) ve "Onay bekliyor" durumunda "Bizi arayın / WhatsApp" butonu.
- Bulunamazsa: dostça hata kartı ("Bu kodla kayıt bulamadık. Kodu kontrol edin veya bizi arayın.").
- Demo modu açıkken sayfada küçük bir bilgi satırı: "Demo verilerle çalışmaktadır." (`NEXT_PUBLIC_DEMO_MODE=true`).

### 9.2 API: `GET /api/repair-status?code=TS-2026-48213&phone4=1234`
- Başarılı: `200 { ok: true, repair: Repair }`
- Bulunamadı: `404 { ok: false, error: "not_found" }`
- Rate limit: dakikada 10 sorgu/IP (kod tahminini zorlaştırmak için). Geçersiz formatta `400`.
- Yanıtta müşteri adı **maskelenir** (ör. `A*** Y***`), telefon ve adres **asla** döndürülmez.

### 9.3 Veri Modeli

```ts
type RepairStatus =
  | "received" | "diagnosing" | "awaiting_approval"
  | "repairing" | "testing" | "ready" | "delivered";

interface Repair {
  code: string;                 // "TS-2026-48213"
  customerName: string;         // maskelenerek döner
  phoneLast4: string;
  deviceType: string;
  brand: string;
  model?: string;
  serviceType: string;
  receivedAt: string;           // ISO
  estimatedDelivery?: string;   // ISO
  status: RepairStatus;
  estimatedPrice?: number;      // TL
  history: { at: string; status: RepairStatus; note: { tr: string; en: string } }[];
}
```

### 9.4 Demo Kayıtları (`data/repairs.json`)
En az 5 kayıt, her biri farklı durumda olmalıdır. Geliştirme/denemede kullanılacak kodlar:

| Kod | Telefon son 4 | Durum | Cihaz |
| --- | --- | --- | --- |
| `TS-2026-10001` | `1111` | Teslim Alındı | HP Pavilion 15 Laptop |
| `TS-2026-10002` | `2222` | Arıza Tespiti | Lenovo IdeaPad 3 |
| `TS-2026-10003` | `3333` | Onay Bekliyor (tahmini ücret 1.450 ₺) | Dell Optiplex Masaüstü |
| `TS-2026-10004` | `4444` | Onarımda | ASUS TUF Gaming F15 |
| `TS-2026-10005` | `5555` | Teslime Hazır | MacBook Air M1 |
| `TS-2026-10006` | `6666` | Teslim Edildi | Casper Nirvana X500 |

> `lib/repairs.ts` içinde `getRepairByCode(code)` ve `listRepairs()` fonksiyonları bulunur. API route yalnızca bu fonksiyonları çağırır; böylece veri kaynağı değişince yalnızca bu dosya güncellenir.

---

## 10. Hizmet Verileri (`data/services.ts`)

Her hizmet aşağıdaki şemaya uyar:

```ts
interface Service {
  slug: string;                          // URL
  icon: string;                          // lucide ikon adı
  audience: ("individual" | "company")[];
  title: { tr: string; en: string };
  summary: { tr: string; en: string };   // kart özeti (≤ 140 karakter)
  symptoms: { tr: string[]; en: string[] };
  process: { tr: string[]; en: string[] };
  startingPrice: number;                 // TL
  duration: { tr: string; en: string };  // "1–2 iş günü"
  warranty: { tr: string; en: string };  // "6 ay"
  faq: { q: { tr: string; en: string }; a: { tr: string; en: string } }[];
}
```

### Hizmet Listesi (başlangıç içeriği)

| # | Slug (TR) | Hizmet | İkon | Hedef | Başlangıç fiyatı | Süre | Garanti |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `laptop-tamiri` | Laptop Tamiri (ekran, klavye, batarya) | `Laptop` | Bireysel, Kurumsal | 450 ₺ | 1–3 iş günü | 6 ay |
| 2 | `masaustu-bilgisayar-tamiri` | Masaüstü Bilgisayar Tamiri | `Monitor` | Bireysel, Kurumsal | 350 ₺ | 1–2 iş günü | 6 ay |
| 3 | `format-ve-isletim-sistemi-kurulumu` | Format ve İşletim Sistemi Kurulumu | `HardDriveDownload` | Bireysel, Kurumsal | 300 ₺ | Aynı gün | 1 ay |
| 4 | `veri-kurtarma` | Veri Kurtarma | `DatabaseBackup` | Bireysel, Kurumsal | 750 ₺ | 2–7 iş günü | Başarı garantili |
| 5 | `virus-temizleme` | Virüs / Kötü Amaçlı Yazılım Temizliği | `ShieldCheck` | Bireysel, Kurumsal | 250 ₺ | Aynı gün | 1 ay |
| 6 | `donanim-yukseltme` | Donanım Yükseltme (SSD, RAM) | `Cpu` | Bireysel, Kurumsal | 200 ₺ (işçilik) | Aynı gün | Parça garantisi |
| 7 | `periyodik-bakim-ve-temizlik` | Periyodik Bakım ve Temizlik | `Sparkles` | Bireysel, Kurumsal | 300 ₺ | Aynı gün | 1 ay |
| 8 | `kurumsal-destek` | Kurumsal Destek (ofisler için) | `Building2` | Kurumsal | Teklif usulü | Sözleşmeye göre | SLA |

- Fiyatlar **örnek (placeholder)** değerlerdir; `site-config`/`services.ts` üzerinden tek yerde değiştirilebilir.
- "Teklif usulü" olan hizmette fiyat sütununda "Teklif alın" yazar ve butona basınca İletişim formu `Kurumsal teklif` konusu seçili açılır.
- Her hizmet için en az: 4 belirti maddesi, 4 süreç adımı, 3 SSS sorusu üretilmelidir (TR ve EN).

---

## 11. Diğer Veri Setleri (Placeholder İçerik)

### 11.1 Ekip (`data/team.ts`) — 5 kişi
Ad, unvan, uzmanlıklar, bio (TR/EN). Örnek: *Genel Müdür / Kurucu*, *Teknik Servis Şefi*, *Donanım Teknisyeni*, *Veri Kurtarma Uzmanı*, *Müşteri İlişkileri Sorumlusu*. İsimler kurgusaldır (ör. "Ahmet Yıldız"); gerçek kişi adı kullanılmaz ve sayfada küçük bir yorum satırıyla "örnek veri" olduğu belirtilir (README'de).

### 11.2 Referanslar (`data/testimonials.ts`) — 6 yorum
Ad (baş harfler + soyad kısaltması), rol/şirket, puan (4–5), 1–3 cümlelik metin (TR/EN).

### 11.3 Müşteri Logoları (`data/clients.ts`) — 8 kayıt
Kurgusal firma adları; gerçek marka logosu **kullanılmaz**. Logo yerine tek renkli metin-logo bileşeni üretilir.

### 11.4 SSS (`data/faq.ts`) — 5 kategori × 4–6 soru
Konular: arıza tespit ücreti, onarım süresi, garanti kapsamı, veri gizliliği ve yedekleme, parça kalitesi, adresten alım, ödeme yöntemleri, kurumsal sözleşme, onarılamayan cihaz, ücret onayı süreci. Cevaplar net ve kısa (≤ 3 cümle).

---

## 12. Site Yapılandırması (`lib/site-config.ts`)

Tüm şirket bilgileri **tek dosyadan** okunur; bileşenlerde sabit yazılmaz. Aşağıdaki değerler placeholder'dır ve kullanıcı sonradan günceller.

```ts
export const siteConfig = {
  name: "TeknoServis",                       // PLACEHOLDER – şirket adı
  tagline: { tr: "Bilgisayarınız güvenli ellerde", en: "Your computer is in safe hands" },
  foundedYear: 2014,                         // PLACEHOLDER
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ornek-servis.com",
  contact: {
    phone: "+90 224 000 00 00",              // PLACEHOLDER
    whatsapp: "905320000000",                // PLACEHOLDER (başında + yok)
    email: "info@ornek-servis.com",          // PLACEHOLDER
    address: { tr: "Örnek Mah. Teknoloji Cad. No:1, Nilüfer / Bursa", en: "Ornek Mah. Teknoloji Cad. No:1, Nilufer / Bursa" },  // PLACEHOLDER
    mapEmbedUrl: "",                         // Google Maps embed linki; boşsa harita yerine adres kartı göster
    mapLink: "",
  },
  hours: [
    { days: [1,2,3,4,5], open: "09:00", close: "18:30" },
    { days: [6],         open: "09:00", close: "16:00" },
    // Pazar kapalı
  ],
  social: { instagram: "#", linkedin: "#", x: "#", youtube: "#" },  // boş/“#” olanlar gösterilmez
  stats: { repairedDevices: 5000, satisfaction: 98, avgRepairHours: 24 }, // PLACEHOLDER
};
```

- `hours` verisi hem Header bilgi çubuğunda, hem İletişim sayfasında, hem de JSON-LD'de kullanılır.
- "Şu an açık/kapalı" göstergesi (Europe/Istanbul saatine göre) Header bilgi çubuğunda ve İletişim sayfasında gösterilir.

---

## 13. SEO

- Her sayfa için `generateMetadata`: `title` (şablon: `%s | {şirket adı}`), `description` (≤160 karakter), `canonical`, `alternates.languages` (hreflang), Open Graph (`og:title/description/image/locale`), Twitter card (`summary_large_image`).
- **Dinamik OG görseli:** `app/[locale]/opengraph-image.tsx` ile marka renkli, başlık içeren 1200×630 görsel; blog yazıları için yazı başlığıyla.
- `app/sitemap.ts`: tüm statik sayfalar, hizmet detayları, blog yazıları, her iki dilde, `alternates` ile.
- `app/robots.ts`: tümüne izin ver, sitemap'i belirt; `/api/` engelle.
- **JSON-LD (structured data):**
  - Site genelinde `LocalBusiness` (alt tür `ComputerRepair` / `Store`): ad, adres, telefon, çalışma saatleri, `geo`, `sameAs`, `priceRange`.
  - Hizmet detayında `Service`; SSS'de ve hizmet SSS'lerinde `FAQPage`; blogda `Article`; tüm iç sayfalarda `BreadcrumbList`.
- Anlamsal HTML: sayfa başına tek `<h1>`, mantıklı başlık sırası, `<main>`, `<nav>`, `<article>`, `<footer>`.
- Yerel SEO: başlık ve açıklamalarda şehir adı (`site-config` adresinden türetilir) doğal biçimde geçer.
- Görseller için anlamlı `alt` metinleri; dekoratif görsellerde `alt=""`.
- 404 sayfası: yardımcı bağlantılar (Ana sayfa, Hizmetler, İletişim) ve arama önerisi.

---

## 14. Performans

- `next/image` ile tüm görseller (uygun `sizes`, `priority` yalnızca hero görselinde), WebP/AVIF.
- `next/font` ile self-host Inter, `display: swap`, yalnızca gerekli ağırlıklar (400, 500, 600, 700).
- Mümkün olan tüm sayfalar **statik üretilir** (SSG). Yalnızca API route'ları dinamiktir.
- Ağır bileşenler (Carousel, Harita, framer-motion) `dynamic import` ve lazy-load ile yüklenir; harita **kullanıcı görünüme getirince** yüklenir.
- Üçüncü taraf script'ler: varsayılan olarak **yok**. Analitik eklenecekse (`NEXT_PUBLIC_GA_ID` varsa) `next/script` ile `afterInteractive`.
- CLS önleme: görsellerde sabit boyut/aspect-ratio, font fallback metrikleri.
- JS bundle hedefi: ilk yükleme sayfa başına < 150 KB (gzip).
- Uygun `Cache-Control` ve statik varlıklar için uzun ömürlü önbellek.

---

## 15. Erişilebilirlik (WCAG 2.2 AA)

- Tüm işlevler klavye ile kullanılabilir; mantıklı sekme sırası; modal/menülerde odak tuzağı ve `Esc` ile kapatma, kapanınca odak tetikleyiciye döner.
- "İçeriğe geç" bağlantısı.
- Renk tek başına anlam taşımaz (durum, hata, form doğrulaması ikon/metinle desteklenir).
- Form alanları görünür `<label>` ile ilişkili; zorunlu alanlar `aria-required` ve görsel işaretle; hata mesajları `aria-live`/`role="alert"`.
- Dokunmatik hedef boyutu en az **44×44 px**.
- `lang` özniteliği dile göre (`tr`/`en`), dil değiştirici bağlantılarında `hreflang` ve `lang`.
- Carousel: duraklat/ileri/geri kontrolleri, otomatik oynatma yok, `aria-roledescription="carousel"`.
- Accordion: `button` + `aria-expanded` + `aria-controls`.
- Sayaç animasyonları ve geçişler `prefers-reduced-motion` ile devre dışı kalır.
- Tema değişiminde sayfa yanıp sönmez (FOUC yok): `next-themes` ile `suppressHydrationWarning` ve ilk boyamadan önce tema uygulanır.
- Tüm görseller için alternatif metin; ikon-yalnızca butonlarda `aria-label`.

---

## 16. Ortam Değişkenleri (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://www.ornek-servis.com
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_GA_ID=                 # boşsa analitik yüklenmez

# E-posta bildirimleri
RESEND_API_KEY=                    # boşsa e-postalar konsola log'lanır
NOTIFY_EMAIL_TO=info@ornek-servis.com
NOTIFY_EMAIL_FROM=Servis <no-reply@ornek-servis.com>
```

---

## 17. Varsayımlar ve Placeholder'lar

Kullanıcı bu bilgileri henüz vermediği için aşağıdaki varsayımlar yapılmıştır. Hepsi **tek noktadan** (`site-config.ts`, `data/*`, `messages/*`) değiştirilebilir olmalı ve README'de listelenmelidir.

- Şirket adı, slogan, kuruluş yılı, adres, telefon, WhatsApp, e-posta ve sosyal medya hesapları → **örnek değerler** (Bölüm 12).
- Şehir: Bursa (adres örneğinde). Harita linki boşsa harita yerine adres kartı gösterilir.
- Hizmet listesi ve fiyatlar → Bölüm 10'daki varsayılanlar.
- Hedef kitle: **hem bireysel hem kurumsal**; dilin tonu sade, güven verici ve anlaşılır.
- Servis formu bildirimleri: **e-posta** (anahtar yoksa konsola log).
- Güven rakamları → `site-config.stats` içindeki örnek değerler.
- Ekip, referans ve müşteri logoları → **kurgusal** içerik; gerçek kişi veya marka kullanılmaz.
- Fotoğraf yoksa: SVG illüstrasyon, gradyan kapaklar ve baş harfli avatarlar kullanılır; harici stok görsel indirilmez.
- Gizlilik ve KVKK sayfaları → standart, kısa **taslak metin** (hukuki danışmanlıkla güncellenmesi gerektiği not düşülür).

---

## 18. Uygulama Sırası (Önerilen Fazlar)

0. **Skill kurulumu:** Bölüm 2.1'deki `frontend-design` ve `senior-frontend` skill'lerini kur ve doğrula.
1. **Kurulum:** Next.js + TS + Tailwind, ESLint/Prettier, klasör yapısı, `next-intl` ve `next-themes` entegrasyonu, design token'lar, font.
2. **Temel UI:** Button, Card, Input, Select, Accordion, Toast, Breadcrumb vb. + Header, Footer, FloatingContact, dil/tema anahtarları.
3. **Veri ve içerik katmanı:** `site-config`, `services`, `team`, `testimonials`, `clients`, `faq`, `repairs.json`, `messages/*.json`.
4. **Sayfalar:** Ana sayfa → Hizmetler (liste + detay) → Hakkımızda → Ekip ve Referanslar → SSS → İletişim.
5. **Blog:** MDX altyapısı, liste/detay, kategori filtre, arama, başlangıç yazıları (TR/EN).
6. **Formlar ve API:** Servis talebi, iletişim, cihaz sorgulama; zod şemaları, rate limit, honeypot, e-posta gönderimi.
7. **SEO:** metadata, hreflang, sitemap, robots, OG görselleri, JSON-LD.
8. **Cila ve kalite:** `frontend-design` + `senior-frontend` skill'leriyle tasarım/kod gözden geçirmesi, erişilebilirlik denetimi, performans optimizasyonu, responsive kontrol, 404, çerez bildirimi, gizlilik/KVKK sayfaları.
9. **Dokümantasyon:** README (kurulum, ortam değişkenleri, içerik nasıl güncellenir, placeholder listesi, yayına alma).

---

## 19. Kabul Kriterleri (Kontrol Listesi)

- [ ] `frontend-design` ve `senior-frontend` skill'leri kurulmuş ve arayüz bunlara göre geliştirilip gözden geçirilmiştir.
- [ ] `npm run build` hatasız tamamlanır; TypeScript ve ESLint hatası yoktur.
- [ ] TR ve EN tüm sayfalar çalışır; dil değiştirici karşılık gelen sayfaya götürür; çevrilmemiş anahtar yoktur.
- [ ] Aydınlık/karanlık/sistem teması çalışır, seçim kalıcıdır, yanıp sönme yoktur.
- [ ] 8 hizmetin hepsi için detay sayfası üretilir; fiyat tablosu mobilde okunabilir.
- [ ] Servis talebi formu: doğrulama, koşullu alanlar, honeypot, başarı ekranı ve takip kodu çalışır.
- [ ] Demo kodlarla (Bölüm 9.4) cihaz sorgulama tüm durumları doğru gösterir; hatalı kod için hata kartı çıkar.
- [ ] İletişim formu ve harita/adres kartı çalışır; "şu an açık/kapalı" göstergesi doğrudur.
- [ ] WhatsApp ve telefon butonları doğru bağlantıyı açar, mobilde sabit görünür.
- [ ] Blog: liste, kategori filtresi, arama, yazı sayfası, içindekiler ve ilgili yazılar çalışır.
- [ ] SSS accordion ve arama çalışır; `FAQPage` JSON-LD doğrulanır.
- [ ] `sitemap.xml`, `robots.txt`, hreflang, canonical ve OG etiketleri üretilir.
- [ ] Lighthouse mobil hedefleri (Bölüm 1.1) karşılanır.
- [ ] Klavye ile tüm site gezilebilir; ekran okuyucuda form hataları duyulur.
- [ ] 360px, 768px, 1280px ve 1920px genişliklerde yerleşim bozulmaz.
- [ ] README placeholder listesini ve içerik güncelleme adımlarını içerir.

---

## 20. Genel Kodlama Kuralları

- Bileşenler küçük ve tek sorumluluklu; tekrar eden yapılar `components/ui` ve `components/sections` altında yeniden kullanılır.
- Sihirli string/sayı yok: sabitler `lib/constants.ts` veya `site-config`te.
- Sunucu bileşenleri varsayılandır; yalnızca etkileşim gereken yerde `"use client"` kullanılır.
- Tüm kullanıcıya görünen metinler çeviri dosyalarından gelir.
- Erişilebilirlik ve responsive davranış her bileşenin tanımının bir parçasıdır, sonradan eklenecek bir şey değildir.
- Anlamlı commit/klasör isimlendirmesi; ölü kod ve kullanılmayan bağımlılık bırakılmaz.
