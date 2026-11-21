(function () {
  "use strict";

  const YAZILAR = Array.isArray(window.YAZILAR) ? window.YAZILAR : [];
  const AYARLAR = window.SITE_AYARLARI || {
    siteBasligi: "Serkan | Yazılar & Projeler",
    yazarAdi: "Serkan",
    mediumProfilUrl: "https://medium.com/@serkan3311a"
  };

  const FONT_BOYUTLARI = [1.04, 1.16, 1.28];
  const FONT_ETIKETLERI = ["Küçük", "Normal", "Büyük"];
  let aktifFontIndeksi = yukleFontIndeksi();

  const durum = {
    kategori: "Tümü",
    arama: "",
    gorunum: "liste",
    aktifYaziId: null
  };

  const els = {
    progressBar: document.getElementById("reading-progress"),
    navYazilar: document.getElementById("nav-yazilar"),
    navHakkimda: document.getElementById("nav-hakkimda"),
    brandHomeLink: document.getElementById("brand-home-link"),
    viewListe: document.getElementById("view-liste"),
    viewOkuma: document.getElementById("view-okuma"),
    viewHakkimda: document.getElementById("view-hakkimda"),
    categoryPills: document.getElementById("category-pills"),
    searchInput: document.getElementById("search-input"),
    searchClear: document.getElementById("search-clear"),
    articlesGrid: document.getElementById("articles-grid"),
    archiveNote: document.getElementById("archive-note"),
    emptyState: document.getElementById("empty-state"),
    resetFiltersBtn: document.getElementById("reset-filters-btn"),
    backToListBtn: document.getElementById("back-to-list-btn"),
    fontCycleBtn: document.getElementById("font-cycle-btn"),
    copyLinkBtn: document.getElementById("copy-link-btn"),
    articleContainer: document.getElementById("article-container"),
    aboutToArticlesBtn: document.getElementById("about-to-articles-btn"),
    toast: document.getElementById("toast")
  };

  let toastZamanlayici = null;

  function escapeHtml(metin) {
    return String(metin || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function yukleFontIndeksi() {
    try {
      const kayit = Number(localStorage.getItem("serkan_okuma_boyutu"));
      if (kayit >= 0 && kayit < FONT_BOYUTLARI.length) {
        return kayit;
      }
    } catch (_) {
      /* Yerel depolama kapalıysa varsayılan boyutla devam edilir */
    }
    return 1;
  }

  function uygulaFontBoyutu() {
    const boyut = FONT_BOYUTLARI[aktifFontIndeksi] || FONT_BOYUTLARI[1];
    document.documentElement.style.setProperty("--reader-font-size", boyut + "rem");
    if (els.fontCycleBtn) {
      els.fontCycleBtn.textContent = "Yazı Boyutu: " + FONT_ETIKETLERI[aktifFontIndeksi];
    }
  }

  function siradakiFontBoyutu() {
    aktifFontIndeksi = (aktifFontIndeksi + 1) % FONT_BOYUTLARI.length;
    uygulaFontBoyutu();
    try {
      localStorage.setItem("serkan_okuma_boyutu", String(aktifFontIndeksi));
    } catch (_) {
      /* Yoksay */
    }
  }

  function duzMetneCevir(html) {
    const gecici = document.createElement("div");
    gecici.innerHTML = html || "";
    return (gecici.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("tr-TR");
  }

  const aramaIndeksi = new Map(
    YAZILAR.map(function (yazi) {
      const birlesik = [
        yazi.baslik,
        yazi.altBaslik,
        yazi.kategori,
        (yazi.etiketler || []).join(" "),
        duzMetneCevir(yazi.icerikHtml)
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return [yazi.id, birlesik];
    })
  );

  function benzersizKategoriler() {
    const liste = ["Tümü"];
    YAZILAR.forEach(function (yazi) {
      const tumu = [yazi.kategori].concat(yazi.etiketler || []);
      tumu.forEach(function (etiket) {
        if (etiket && liste.indexOf(etiket) === -1) {
          liste.push(etiket);
        }
      });
    });
    return liste;
  }

  function filtreliYazilar() {
    const aranan = durum.arama.trim().toLocaleLowerCase("tr-TR");
    return YAZILAR.filter(function (yazi) {
      const etiketler = [yazi.kategori].concat(yazi.etiketler || []);
      const kategoriUygun =
        durum.kategori === "Tümü" || etiketler.indexOf(durum.kategori) !== -1;
      if (!kategoriUygun) return false;
      if (!aranan) return true;
      const metin = aramaIndeksi.get(yazi.id) || "";
      return metin.indexOf(aranan) !== -1;
    });
  }

  function kategorileriCiz() {
    const kategoriler = benzersizKategoriler();
    els.categoryPills.innerHTML = kategoriler
      .map(function (kat) {
        const aktif = kat === durum.kategori ? " is-active" : "";
        return (
          '<button type="button" class="filter-pill' +
          aktif +
          '" data-kategori="' +
          escapeHtml(kat) +
          '">' +
          escapeHtml(kat) +
          "</button>"
        );
      })
      .join("");
  }

  function kartlariCiz() {
    const liste = filtreliYazilar();
    els.searchClear.classList.toggle("hidden", durum.arama.trim().length === 0);

    if (liste.length === 0) {
      els.articlesGrid.innerHTML = "";
      els.emptyState.classList.remove("hidden");
      els.archiveNote.classList.add("hidden");
      return;
    }

    els.emptyState.classList.add("hidden");
    els.archiveNote.classList.toggle(
      "hidden",
      durum.kategori !== "Tümü" || durum.arama.trim().length > 0
    );

    els.articlesGrid.innerHTML = liste
      .map(function (yazi) {
        const etiketHtml = (yazi.etiketler || [])
          .map(function (etiket) {
            return '<span class="tag-chip">' + escapeHtml(etiket) + "</span>";
          })
          .join("");

        const formulHtml = yazi.onizlemeFormulu
          ? '<div class="card-preview-formula">' + escapeHtml(yazi.onizlemeFormulu) + "</div>"
          : "";

        return (
          '<article class="article-card" tabindex="0" role="button" data-yazi-id="' +
          escapeHtml(yazi.id) +
          '">' +
          '<div class="card-meta">' +
          '<span class="card-badge">' +
          escapeHtml(yazi.kategori) +
          "</span>" +
          "<span>•</span>" +
          "<span>" +
          escapeHtml(yazi.tarih) +
          "</span>" +
          "<span>•</span>" +
          "<span>" +
          escapeHtml(yazi.okumaSuresi) +
          "</span>" +
          "</div>" +
          '<h2 class="card-title">' +
          escapeHtml(yazi.baslik) +
          "</h2>" +
          '<p class="card-subtitle">' +
          escapeHtml(yazi.altBaslik) +
          "</p>" +
          formulHtml +
          '<div class="card-footer">' +
          '<div class="tag-list">' +
          etiketHtml +
          "</div>" +
          '<span class="read-more-cta">Yazıyı Oku &rarr;</span>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function yaziCiz(yazi) {
    const etiketHtml = (yazi.etiketler || [])
      .map(function (etiket) {
        return '<span class="tag-chip">' + escapeHtml(etiket) + "</span>";
      })
      .join("");

    const kaynakLinkHtml = yazi.kaynakUrl
      ? '<a class="source-link" href="' +
        escapeHtml(yazi.kaynakUrl) +
        '" target="_blank" rel="noopener noreferrer">Medium\'daki Aslı &#8599;</a>'
      : "";

    const basHarf = escapeHtml((yazi.yazar || "S").charAt(0).toUpperCase());

    els.articleContainer.innerHTML =
      '<header class="article-header">' +
      '<div class="article-tags-row">' +
      etiketHtml +
      "</div>" +
      '<h1 class="article-title">' +
      escapeHtml(yazi.baslik) +
      "</h1>" +
      '<p class="article-subtitle">' +
      escapeHtml(yazi.altBaslik) +
      "</p>" +
      '<div class="article-byline">' +
      '<div class="byline-author">' +
      '<span class="author-avatar">' +
      basHarf +
      "</span>" +
      "<div>" +
      '<span class="author-name">' +
      escapeHtml(yazi.yazar) +
      "</span>" +
      " &middot; " +
      "<span>" +
      escapeHtml(yazi.tarih) +
      "</span>" +
      " &middot; " +
      "<span>" +
      escapeHtml(yazi.okumaSuresi) +
      "</span>" +
      "</div>" +
      "</div>" +
      kaynakLinkHtml +
      "</div>" +
      "</header>" +
      '<div class="article-prose">' +
      (yazi.icerikHtml || "") +
      "</div>" +
      '<div class="article-divider">&bull; &bull; &bull;</div>' +
      '<footer class="article-end-card">' +
      "<span><strong>" +
      escapeHtml(yazi.yazar) +
      "</strong> tarafından paylaşıldı.</span>" +
      '<button type="button" class="back-btn" id="inline-back-btn">&larr; Tüm Yazılara Dön</button>' +
      "</footer>";

    const altDonButonu = document.getElementById("inline-back-btn");
    if (altDonButonu) {
      altDonButonu.addEventListener("click", function () {
        rotayaGit("yazilar");
      });
    }
  }

  function gorunumuGuncelle() {
    els.viewListe.classList.toggle("hidden", durum.gorunum !== "liste");
    els.viewOkuma.classList.toggle("hidden", durum.gorunum !== "okuma");
    els.viewHakkimda.classList.toggle("hidden", durum.gorunum !== "hakkimda");

    els.navYazilar.classList.toggle(
      "is-active",
      durum.gorunum === "liste" || durum.gorunum === "okuma"
    );
    els.navHakkimda.classList.toggle("is-active", durum.gorunum === "hakkimda");

    if (durum.gorunum !== "okuma") {
      els.progressBar.style.width = "0%";
    }
  }

  function okumaIlerlemesiniGuncelle() {
    if (durum.gorunum !== "okuma") {
      els.progressBar.style.width = "0%";
      return;
    }
    const toplamKaydirma = document.documentElement.scrollHeight - window.innerHeight;
    if (toplamKaydirma <= 0) {
      els.progressBar.style.width = "100%";
      return;
    }
    const oran = Math.min(100, Math.max(0, (window.scrollY / toplamKaydirma) * 100));
    els.progressBar.style.width = oran.toFixed(1) + "%";
  }

  function rotayiUygula() {
    const hash = decodeURIComponent(window.location.hash || "");

    if (hash.indexOf("#yazi/") === 0) {
      const id = hash.slice(6);
      const yazi = YAZILAR.find(function (item) {
        return item.id === id;
      });
      if (yazi) {
        durum.gorunum = "okuma";
        durum.aktifYaziId = yazi.id;
        document.title = yazi.baslik + " — " + AYARLAR.yazarAdi;
        yaziCiz(yazi);
        gorunumuGuncelle();
        window.scrollTo(0, 0);
        okumaIlerlemesiniGuncelle();
        return;
      }
    }

    if (hash === "#hakkimda") {
      durum.gorunum = "hakkimda";
      durum.aktifYaziId = null;
      document.title = "Hakkımda — " + AYARLAR.siteBasligi;
      gorunumuGuncelle();
      window.scrollTo(0, 0);
      return;
    }

    durum.gorunum = "liste";
    durum.aktifYaziId = null;
    document.title = AYARLAR.siteBasligi;
    kategorileriCiz();
    kartlariCiz();
    gorunumuGuncelle();
    window.scrollTo(0, 0);
  }

  function rotayaGit(hedef) {
    if (hedef === "yazilar") {
      if (window.location.hash && window.location.hash !== "#yazilar") {
        window.location.hash = "yazilar";
      } else {
        rotayiUygula();
      }
      return;
    }
    window.location.hash = hedef;
  }

  function bildirimGoster(mesaj) {
    els.toast.textContent = mesaj;
    els.toast.classList.add("is-visible");
    if (toastZamanlayici) {
      clearTimeout(toastZamanlayici);
    }
    toastZamanlayici = setTimeout(function () {
      els.toast.classList.remove("is-visible");
    }, 2400);
  }

  function baglantiyiKopyala() {
    const adres = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(adres)
        .then(function () {
          bildirimGoster("Yazı bağlantısı kopyalandı.");
        })
        .catch(function () {
          yedekKopyala(adres);
        });
      return;
    }
    yedekKopyala(adres);
  }

  function yedekKopyala(metin) {
    try {
      const alan = document.createElement("textarea");
      alan.value = metin;
      alan.setAttribute("readonly", "");
      alan.style.position = "fixed";
      alan.style.opacity = "0";
      document.body.appendChild(alan);
      alan.select();
      const basarili = document.execCommand("copy");
      document.body.removeChild(alan);
      bildirimGoster(basarili ? "Yazı bağlantısı kopyalandı." : "Adres çubuğundan kopyalayabilirsiniz.");
    } catch (_) {
      bildirimGoster("Adres çubuğundan kopyalayabilirsiniz.");
    }
  }

  function olaylariBagla() {
    els.brandHomeLink.addEventListener("click", function (e) {
      e.preventDefault();
      rotayaGit("yazilar");
    });

    els.navYazilar.addEventListener("click", function () {
      rotayaGit("yazilar");
    });

    els.navHakkimda.addEventListener("click", function () {
      rotayaGit("hakkimda");
    });

    if (els.aboutToArticlesBtn) {
      els.aboutToArticlesBtn.addEventListener("click", function () {
        rotayaGit("yazilar");
      });
    }

    els.categoryPills.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-kategori]");
      if (!btn) return;
      durum.kategori = btn.getAttribute("data-kategori") || "Tümü";
      kategorileriCiz();
      kartlariCiz();
    });

    els.searchInput.addEventListener("input", function (e) {
      durum.arama = e.target.value || "";
      kartlariCiz();
    });

    els.searchClear.addEventListener("click", function () {
      durum.arama = "";
      els.searchInput.value = "";
      kartlariCiz();
      els.searchInput.focus();
    });

    els.resetFiltersBtn.addEventListener("click", function () {
      durum.kategori = "Tümü";
      durum.arama = "";
      els.searchInput.value = "";
      kategorileriCiz();
      kartlariCiz();
    });

    els.articlesGrid.addEventListener("click", function (e) {
      const kart = e.target.closest("[data-yazi-id]");
      if (!kart) return;
      rotayaGit("yazi/" + kart.getAttribute("data-yazi-id"));
    });

    els.articlesGrid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const kart = e.target.closest("[data-yazi-id]");
      if (!kart) return;
      e.preventDefault();
      rotayaGit("yazi/" + kart.getAttribute("data-yazi-id"));
    });

    els.backToListBtn.addEventListener("click", function () {
      rotayaGit("yazilar");
    });

    els.fontCycleBtn.addEventListener("click", siradakiFontBoyutu);
    els.copyLinkBtn.addEventListener("click", baglantiyiKopyala);

    window.addEventListener("hashchange", rotayiUygula);
    window.addEventListener("scroll", okumaIlerlemesiniGuncelle, { passive: true });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && durum.gorunum === "okuma") {
        rotayaGit("yazilar");
      }
    });
  }

  uygulaFontBoyutu();
  olaylariBagla();
  rotayiUygula();
})();
