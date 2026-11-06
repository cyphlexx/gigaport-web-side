# Gigaport – Tasarım Planı (frontend-design skill, 1. geçiş)

## Konu, kitle, ana iş
- **Konu:** Osmangazi'de, 20+ yıllık, fiziksel bir onarım tezgâhı. Somut malzemeler: ESD mat (lacivert/gri), hassas tornavida uçları, anakart, termal macun, servis fişi + takip kodu.
- **Kitle:** Bilgisayarı bozulmuş, endişeli birey (mobil, acil) + BT desteği arayan KOBİ (masaüstü, araştırmacı).
- **Ana iş:** Güven ver → servis talebi / ara / WhatsApp.

## Fikir: "Servis fişi"
Servis fişi işletmenin gerçek dünyasından gelen nesne; takip kodu (`TS-2026-…`) ve 7 aşamalı durum, sitenin ayırt edici özelliği (Cihaz Sorgula). Cesaretin tek harcandığı yer:
**Hero = tam genişlikte fotogerçekçi tezgâh fotoğrafı (desktop'ta sessiz video döngüsü) + üzerine yerleşmiş gerçekçi bir "servis fişi" kartı** (takip kodu, cihaz, canlı durum çizgisi). Ziyaretçi ilk saniyede "burada cihazım takip ediliyor" mesajını görür. Geri kalan her şey sakin ve disiplinli.

## Renk (gerçek marka CSS'inden türetildi)
| Ad | Hex | Rol |
| --- | --- | --- |
| Lacivert (mürekkep) | `#0A293D` | Başlıklar, koyu bölümler, footer |
| Gigaport mavisi | `#0089F7` | Logodaki üçgen; yalnızca vurgu/ikon/koyu zeminde metin (beyazda 3.4:1 → metin için kullanılmaz) |
| Derin mavi | `#0B5FA8` | Birincil buton, link (beyaz üzerinde 6.6:1) |
| Kâğıt | `#F3F6F9` | Alternatif bölüm zemini (soğuk, krem değil) |
| Çelik | `#526477` | İkincil metin |
| Sinyal yeşili | `#2FB350` / koyu `#1C7A35` | Yalnızca "hazır/açık/başarılı" durumları + WhatsApp |
Karanlık tema: zemin `#07141F`, yüzey `#0C1F2E`, metin `#E4ECF3`, birincil `#4DA8FF`.

## Tipografi
- Tek aile: **Plus Jakarta Sans** (markanın mevcut fontu, latin-ext, 400/500/600/700/800). Başlıklar 800, sıkı harf aralığı (-0.03em), büyük ölçek (H1 clamp 2.4→4.25rem). Gövde 400, 1.65 satır yüksekliği, ≤ 70 karakter satır.
- Takip kodları `tabular-nums` (monospace yok).
- Yasak: tek kelimeyi renklendirme, ALL-CAPS eyebrow, "→" buton metni, "A · B · C" meta dizileri.

## Yerleşim
- Sola hizalı, asimetrik. 12 kolon, 1200px.
```
HERO (tam genişlik fotoğraf, alt-sol koyu degrade)
┌──────────────────────────────────────────────┐
│ H1 (sol, 7 kol)                ┌──────────┐  │
│ alt metin                      │ SERVİS   │  │
│ [Servis talebi] [Ara]          │ FİŞİ     │  │
│ ✓ ücretsiz tespit ✓ onaysız…   │ TS-2026… │  │
│                                └──────────┘  │
└──────────────────────────────────────────────┘
Rakamlar: hero altında ince şerit (kart değil), 4 sütun, dikey çizgilerle ayrık
Hizmetler: fotoğraflı "dizin" — 2 büyük fotoğraf karosu + 6 satırlık liste (özdeş kart ızgarası değil)
Süreç: gerçekten sıralı → numaralı, yatay zaman çizgisi
```
- Köşe hiyerarşisi: fotoğraf/büyük yüzey 20px, kart 14px, buton/input 10px, rozet tam. Gölge yalnızca yüzen öğelerde (servis fişi, menü, toast).

## İlkeler
1. Gerçek fotoğraf, gerçek bilgi: uydurma insan/yorum/logo yok.
2. Tek hareket anı: hero'da servis fişindeki durum çizgisinin dolması. Bölüm başına fade-up yok.
3. Etkileşim tepkileri (accordion, menü, form) hareketli; dekoratif hareket yok.
4. Metin kullanıcı dilinde, kısa, etken çatı ("Servis talebi oluştur", "Durumu sorgula").

## Plan incelemesi (genel kalıplara karşı)
- İlk taslak "büyük sayı + küçük etiket + degrade" hero'ydu → **değiştirildi**: rakamlar hero'dan çıkarıldı, yerine servis fişi kondu (konuya özgü).
- İlk taslakta 8 özdeş hizmet kartı vardı (SaaS kart kiti) → **değiştirildi**: fotoğraflı dizin düzeni.
- Şartnamedeki Inter → marka fontu Plus Jakarta Sans ile değiştirildi (PROJECT.md 2.1'deki "marka bulunduysa ondan türet" kuralı).
- Şartnamedeki SVG hero illüstrasyonu → kullanıcının "gerçeğe yakın görsel" isteği üzerine fotogerçekçi fal.ai görseli.
