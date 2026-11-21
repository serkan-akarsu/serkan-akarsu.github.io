/**
 * Sitedeki tüm yazıların ve paylaşımların merkezi listesi.
 * Yeni bir yazı eklemek için bu listenin en başına aynı yapıda yeni bir nesne eklemeniz yeterlidir.
 */
window.SITE_AYARLARI = {
  siteBasligi: "Serkan | Yazılar & Projeler",
  yazarAdi: "Serkan",
  mediumProfilUrl: "https://medium.com/@serkan3311a"
};

window.YAZILAR = [
  {
    id: "geometrik-dizileri-us-almadan-toplamanin-pratik-yolu",
    baslik: "Geometrik Dizileri Üs Almadan Toplamanın Pratik Yolu",
    altBaslik:
      "Terim sayısını saymadan ve büyük üslerle uğraşmadan, sabit katlarla büyüyen sayı dizilerini birkaç saniyede toplamak için basit bir yöntem.",
    kategori: "Matematik",
    etiketler: ["Matematik", "Bilim", "Pratik Bilgiler", "Öğrenme", "Eğitim"],
    yazar: "Serkan",
    tarih: "21 Kasım 2026",
    okumaSuresi: "3 dk okuma",
    onizlemeFormulu: "Toplam = (Son terim − İlk terim) / (n − 1) + Son terim",
    kaynakUrl:
      "https://medium.com/@serkan3311a/geometrik-dizileri-%C3%BCs-almadan-toplaman%C4%B1n-pratik-yolu-3f8a4e506fe5",
    icerikHtml: `
      <div class="lead-question">
        <p>Önce küçük bir soruyla başlayalım:</p>
        <p>5 + 20 + 80 + 320 + 1280 toplamını hesap makinesi kullanmadan ve üs almadan kaç saniyede bulabilirsiniz?</p>
      </div>

      <p>
        Okulda öğrendiğimiz klasik geometrik dizi toplam formülü bunu elbette çözer; ancak o formülü
        uygulamak için önce dizide kaç terim olduğunu saymanız, sonra artış katının o kadar kuvvetini
        hesaplamanız gerekir. Sayılar büyüdükçe bu işlem hem yorucu hem de hata yapmaya açık hâle gelir.
      </p>

      <p>
        Sayı örüntüleriyle uğraşırken, pozitif bir sayının sürekli aynı katı alınarak ilerleyen bu tür
        dizileri çok daha hızlı toplamanın pratik bir yolunu fark ettim. Üstelik ne terim sayısını
        bilmeniz ne de üs almanız gerekiyor.
      </p>

      <h2>Kısayol Nasıl Çalışıyor?</h2>

      <p>
        Elinizde her adımda belirli bir kat (<code>n</code>) artarak ilerleyen pozitif sayılar varsa
        toplamı bulmak için sadece üç adım yeterli:
      </p>

      <ol>
        <li>En büyük sayıdan en küçük sayıyı çıkarın.</li>
        <li>Çıkan sonucu, sayılar kaç kat artıyorsa onun 1 eksiğine bölün.</li>
        <li>Bulduğunuz değeri en büyük sayı ile toplayın.</li>
      </ol>

      <p>Tek satırda özetlersek:</p>

      <div class="formula-box">
        <span class="formula-label">Kısayol Formülü</span>
        <div class="formula-text">Toplam = (En büyük sayı − En küçük sayı) / (n − 1) + En büyük sayı</div>
      </div>

      <h2>İki Örnekle Test Edelim</h2>

      <div class="example-card">
        <h3>Örnek 1 · 3 kat artan sayılar</h3>
        <p><code>1 + 3 + 9</code> toplamına bakalım (<code>n = 3</code>).</p>
        <ul>
          <li>En büyük sayıdan en küçük sayıyı çıkaralım: <code>9 - 1 = 8</code></li>
          <li>Artış katının 1 eksiğine (<code>3 - 1 = 2</code>) bölelim: <code>8 / 2 = 4</code></li>
          <li>Sonucu en büyük sayı ile toplayalım: <code>4 + 9 = 13</code></li>
        </ul>
        <p>Sağlamasını yapalım: <code>1 + 3 + 9 = 13</code>. Tam isabet.</p>
      </div>

      <div class="example-card">
        <h3>Örnek 2 · 4 kat artan sayılar</h3>
        <p>Şimdi yazının başındaki daha büyük işleme dönelim: <code>5 + 20 + 80 + 320 + 1280</code> (<code>n = 4</code>).</p>
        <div class="calc-steps">
          (1280 - 5) / (4 - 1) + 1280<br>
          = 1275 / 3 + 1280<br>
          = 425 + 1280<br>
          = 1705
        </div>
        <p>
          Tek tek toplamak ya da <code>4<sup>5</sup></code> gibi üslerle uğraşmak yerine tek bir bölme ve
          bir toplama işlemiyle sonuca ulaştık.
        </p>
      </div>

      <h2>Peki Bu Yöntem Neden Çalışıyor?</h2>

      <p>
        Bu kısayol aslında matematikte uzun süredir bilinen geometrik dizi toplam formülünün farklı ve
        oldukça pratik bir yazılışı. Karmaşık harflere girmeden, mantığını doğrudan <code>1 + 3 + 9</code>
        örneği üzerinden görelim:
      </p>

      <ol>
        <li>
          Önce en büyük sayı olan <code>9</code>'u şimdilik kenara ayıralım. Elimizde sadece <code>1 + 3</code> kalır.
        </li>
        <li>
          Kalan bu <code>1 + 3</code> toplamını, artış katı olan <code>3</code> ile çarpalım:
          <code>3 × (1 + 3) = 3 + 9</code>. Dikkat ederseniz, çarpma işlemi her sayıyı bir adım büyüttü
          (<code>1</code> oldu <code>3</code>, <code>3</code> oldu <code>9</code>).
        </li>
        <li>
          Şimdi elimizdeki bu yeni toplamdan (<code>3 + 9</code>), az önceki küçük toplamı (<code>1 + 3</code>) çıkaralım:
          <ul>
            <li>
              Bir tarafta <code>(1 + 3)</code> toplamının <strong>3 katından 1 katını</strong> çıkardığımız için
              geriye <strong>2 katı</strong> kalır (yani artış katının 1 eksiği: <code>3 - 1</code>).
            </li>
            <li>
              Diğer tarafta <code>(3 + 9)</code> içinden <code>(1 + 3)</code> çıkınca ortadaki <code>3</code>'ler
              birbirini yok eder; geriye sadece en büyük sayı ile en küçük sayının farkı (<code>9 - 1</code>) kalır.
            </li>
          </ul>
        </li>
        <li>
          Yani <code>(1 + 3)</code> toplamının <strong>2 katı</strong>, <code>9 - 1</code>'e eşittir. İki tarafı
          <code>2</code>'ye (<code>3 - 1</code>'e) böldüğümüzde kenara ayırdığımız <code>9</code> dışındaki tüm
          toplamı bulmuş oluruz: <code>(9 - 1) / (3 - 1)</code>.
        </li>
        <li>
          Son olarak en başta kenara ayırdığımız <code>9</code>'u geri eklediğimizde bütün toplam ortaya çıkar:
        </li>
      </ol>

      <div class="calc-steps">(9 - 1) / (3 - 1) + 9 = 13</div>

      <p>
        Aynı mantık dizi ne kadar uzun olursa olsun işler; aradaki tüm sayılar birbirini götürür, geriye
        yalnızca ilk terim ile son terim kalır:
      </p>

      <div class="formula-box">
        <span class="formula-label">Genel İfade</span>
        <div class="formula-text">Toplam = (Son terim − İlk terim) / (n − 1) + Son terim</div>
      </div>

      <h2>Küçük Ama Önemli İki Not</h2>

      <div class="note-box">
        <ul>
          <li>
            <strong>Artış katı 1 olamaz (<code>n ≠ 1</code>):</strong> Eğer <code>n = 1</code> olursa paydada
            <code>1 - 1 = 0</code> oluşur ve bölme işlemi tanımsız olur. Zaten her adım 1 katıysa tüm sayılar
            birbirine eşittir; toplamak için terim sayısıyla çarpmak yeterlidir.
          </li>
          <li>
            <strong>Negatif ve kesirli sayılarda da çalışır:</strong> Anlaşılması kolay olsun diye başta
            “en büyük sayı” ve “en küçük sayı” ifadelerini kullandım; bunlar pozitif sayılar ve
            <code>n &gt; 1</code> durumu için geçerlidir. Bunların yerine <strong>son terim</strong> ve
            <strong>ilk terim</strong> derseniz, yöntem negatif sayılarda ve kesirli katlarda
            (örneğin <code>n = 0,5</code> veya <code>n = -2</code>) da sorunsuz çalışır.
          </li>
        </ul>
      </div>

      <p>
        Matematikte bazen bildiğimiz kurallara farklı bir açıdan bakmak bile işlemleri şaşırtıcı derecede
        hızlandırabiliyor. Siz de kendi seçtiğiniz bir sayı dizisinde bu yöntemi deneyip sonucu yorumlarda
        paylaşabilirsiniz.
      </p>
    `
  }
];
