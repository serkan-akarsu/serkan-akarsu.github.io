# Serkan | Yazılar & Projeler

Serkan'ın yazılarını, pratik yöntemlerini ve gelecekte paylaşacağı diğer içerikleri bir araya getiren sade, dergi/kitap havasında kişisel web sitesi.

## Klasör Düzeni

- `index.html`: Ana sayfa ve yazı okuma görünümü
- `css/stil.css`: Kitap/dergi okuma teması, tipografi ve yazdırma stilleri
- `js/yazilar.js`: Yayınlanan tüm yazıların ve paylaşımların listesi ve içerikleri
- `js/uygulama.js`: Filtreleme, arama, okuma ilerleme çubuğu ve sayfa içi geçiş mantığı
- `gorseller/`: Site simgesi (`favicon.svg`) ve ileride eklenecek görseller

## Önemli Kararlar

- **Ayrı proje klasörü:** Oyun projelerinden (`serkan oyunlar`) bağımsız kalması için kendi klasöründe tutuldu.
- **Sıfır kurulum ve tek klasörde çalışma:** Sunucu, üyelik veya ek araç gerektirmeden `index.html` dosyası çift tıklanarak doğrudan tarayıcıda açılabilir; aynı zamanda internet yayınına (ör. GitHub Pages) doğrudan hazırdır.
- **Okuma odaklı tema:** Beyaz ve krem tonlarında, göz yormayan kitap/dergi tipografisi tercih edildi.
- **Canlı yayın:** GitHub Pages üzerinden `https://serkan-akarsu.github.io/` adresinde yayınlandı.

## Nasıl Açılır?

- **İnternetten:** `https://serkan-akarsu.github.io/` adresini açabilirsiniz.
- **Bilgisayardan (çevrimdışı):** Klasördeki `index.html` dosyasına çift tıklamanız yeterlidir.

## Yeni Yazı Nasıl Eklenir?

`js/yazilar.js` dosyasındaki `YAZILAR` listesinin en başına aynı şablonda yeni bir yazı kaydı eklemek yeterlidir; ana sayfada, kategorilerde ve aramada otomatik olarak görünür.
