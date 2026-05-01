(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.PORTFOLIO_DATA || {};
    var certificates = data.certificates || [];
    var issuers = data.certificateIssuers || {};
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var thumbnailCache = new Map();

    configurePdfJs();
    renderCertificateTabs(issuers);
    renderCertificateCards(certificates, issuers);
    initCertificateFilters(issuers, prefersReducedMotion);
    initCertificateModal(certificates);
    initCertificateReveal(prefersReducedMotion);
    renderPdfThumbnails(thumbnailCache, issuers);
  });

  function configurePdfJs() {
    if (!window.pdfjsLib) return;
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  function renderCertificateTabs(issuers) {
    var tabs = document.getElementById("certTabs");
    if (!tabs) return;

    var tabData = [
      { label: "All", filter: "all", color: "#6C63FF" },
      { label: "Coursera", filter: "coursera", color: issuers.coursera.color },
      { label: "Infosys", filter: "infosys", color: issuers.infosys.color },
      { label: "MongoDB", filter: "mongodb", color: issuers.mongodb.color },
      { label: "Spoken Tutorial", filter: "spoken", color: issuers.spoken.color },
      { label: "Others", filter: "others", color: "#64748B" }
    ];

    tabs.innerHTML = tabData.map(function (tab, index) {
      return [
        "<button class=\"cert-tab" + (index === 0 ? " active" : "") + "\" type=\"button\"",
        " data-cert-filter=\"" + escapeAttribute(tab.filter) + "\"",
        " style=\"--issuer-color:" + escapeAttribute(tab.color) + "\">",
        escapeHtml(tab.label),
        "</button>"
      ].join("");
    }).join("");
  }

  function renderCertificateCards(certificates, issuers) {
    var container = document.getElementById("certsContainer");
    if (!container) return;

    container.innerHTML = certificates.map(function (cert, index) {
      var issuer = issuers[cert.issuerKey] || { label: cert.issuer, color: "#6C63FF", icon: "fas fa-certificate" };
      var isPdf = getFileType(cert.file) === "pdf";
      var preview = isPdf
        ? renderPdfPreview(cert, issuer)
        : renderImagePreview(cert);

      return [
        "<article class=\"cert-card reveal-item\" data-cert-group=\"" + escapeAttribute(cert.group) + "\"",
        " style=\"--issuer-color:" + escapeAttribute(issuer.color) + "; --reveal-delay:" + (index % 3) * 100 + "ms\">",
        "<div class=\"cert-issuer-bar\">",
        "<span class=\"cert-issuer-icon\"><i class=\"" + escapeAttribute(issuer.icon) + "\" aria-hidden=\"true\"></i></span>",
        "<span>" + escapeHtml(cert.issuer) + "</span>",
        "</div>",
        preview,
        "<div class=\"cert-info\">",
        "<h3>" + escapeHtml(cert.title) + "</h3>",
        "<p>Issued by: " + escapeHtml(cert.issuer) + " <span>" + escapeHtml(cert.year) + "</span></p>",
        "<button class=\"cert-view\" type=\"button\" data-cert-index=\"" + index + "\">View Certificate <i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i></button>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderPdfPreview(cert, issuer) {
    return [
      "<div class=\"cert-preview pdf-preview\" data-kind=\"pdf\" data-file=\"" + escapeAttribute(cert.file) + "\"",
      " style=\"--issuer-color:" + escapeAttribute(issuer.color) + "\">",
      "<div class=\"cert-spinner\" aria-hidden=\"true\"></div>",
      "<canvas aria-label=\"" + escapeAttribute(cert.title) + " certificate preview\"></canvas>",
      "<div class=\"cert-fallback\" hidden>",
      "<i class=\"fas fa-award\" aria-hidden=\"true\"></i>",
      "<span>Certificate Preview</span>",
      "</div>",
      "</div>"
    ].join("");
  }

  function renderImagePreview(cert) {
    return [
      "<div class=\"cert-preview image-preview\" data-kind=\"image\">",
      "<img src=\"" + escapeAttribute(cert.file) + "\" alt=\"" + escapeAttribute(cert.title) + " certificate preview\" loading=\"lazy\">",
      "</div>"
    ].join("");
  }

  function initCertificateFilters(issuers, prefersReducedMotion) {
    var tabs = document.getElementById("certTabs");
    var cards = Array.from(document.querySelectorAll(".cert-card"));
    if (!tabs || !cards.length) return;

    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cert-filter]");
      if (!button) return;
      var filter = button.dataset.certFilter;

      tabs.querySelectorAll(".cert-tab").forEach(function (tab) {
        tab.classList.toggle("active", tab === button);
      });

      cards.forEach(function (card, index) {
        var visible = filter === "all" || card.dataset.certGroup === filter;
        card.classList.toggle("hidden", !visible);
        if (visible && !prefersReducedMotion) {
          card.style.setProperty("--reveal-delay", Math.min(index % 3, 2) * 100 + "ms");
          card.animate(
            [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 360, easing: "ease", fill: "both" }
          );
        }
      });
    });
  }

  function initCertificateModal(certificates) {
    var modal = document.getElementById("certificateModal");
    if (!modal) return;

    var title = modal.querySelector(".modal-title");
    var issuer = modal.querySelector(".modal-issuer");
    var viewer = modal.querySelector(".certificate-viewer");
    var download = modal.querySelector(".download-certificate");
    var zoomIn = modal.querySelector("[data-zoom=\"in\"]");
    var zoomOut = modal.querySelector("[data-zoom=\"out\"]");
    var zoomReset = modal.querySelector("[data-zoom=\"reset\"]");
    var closeButtons = modal.querySelectorAll("[data-modal-close]");
    var zoom = 1;

    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cert-index]");
      if (!button) return;

      var cert = certificates[Number(button.dataset.certIndex)];
      if (!cert) return;
      zoom = 1;

      title.textContent = cert.title;
      issuer.textContent = cert.issuer + " - " + cert.year;
      viewer.innerHTML = renderModalDocument(cert);
      viewer.style.setProperty("--zoom", zoom);
      download.href = cert.file;
      download.setAttribute("download", cert.file.split("/").pop());
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-lock");
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    if (zoomIn) zoomIn.addEventListener("click", function () {
      zoom = Math.min(zoom + 0.15, 1.75);
      viewer.style.setProperty("--zoom", zoom);
    });

    if (zoomOut) zoomOut.addEventListener("click", function () {
      zoom = Math.max(zoom - 0.15, 0.7);
      viewer.style.setProperty("--zoom", zoom);
    });

    if (zoomReset) zoomReset.addEventListener("click", function () {
      zoom = 1;
      viewer.style.setProperty("--zoom", zoom);
    });

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-lock");
      viewer.innerHTML = "";
    }
  }

  function renderModalDocument(cert) {
    if (getFileType(cert.file) === "pdf") {
      return "<iframe class=\"certificate-document\" src=\"" + escapeAttribute(cert.file) + "#toolbar=0\" title=\"" + escapeAttribute(cert.title) + "\"></iframe>";
    }

    return "<img class=\"certificate-document\" src=\"" + escapeAttribute(cert.file) + "\" alt=\"" + escapeAttribute(cert.title) + " certificate\">";
  }

  function renderPdfThumbnails(thumbnailCache) {
    var previews = Array.from(document.querySelectorAll(".pdf-preview"));
    if (!window.pdfjsLib || !previews.length) {
      previews.forEach(showFallback);
      return;
    }

    previews.forEach(function (preview) {
      var file = preview.dataset.file;
      var canvas = preview.querySelector("canvas");
      if (!file || !canvas) return;

      window.setTimeout(function () {
        if (!preview.classList.contains("loaded")) showFallback(preview);
      }, 6500);

      if (thumbnailCache.has(file)) {
        drawCachedThumbnail(canvas, thumbnailCache.get(file), preview);
        return;
      }

      window.pdfjsLib.getDocument({ url: encodeURI(file) }).promise
        .then(function (pdf) {
          return pdf.getPage(1);
        })
        .then(function (page) {
          var baseViewport = page.getViewport({ scale: 1 });
          var scale = 300 / baseViewport.width;
          var viewport = page.getViewport({ scale: scale });
          var context = canvas.getContext("2d");

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          return page.render({ canvasContext: context, viewport: viewport }).promise.then(function () {
            var imageData = canvas.toDataURL("image/jpeg", 0.72);
            thumbnailCache.set(file, { width: canvas.width, height: canvas.height, imageData: imageData });
            var fallback = preview.querySelector(".cert-fallback");
            if (fallback) fallback.hidden = true;
            canvas.hidden = false;
            preview.classList.add("loaded");
          });
        })
        .catch(function () {
          showFallback(preview);
        });
    });
  }

  function drawCachedThumbnail(canvas, cacheEntry, preview) {
    var image = new Image();
    image.onload = function () {
      var context = canvas.getContext("2d");
      canvas.width = cacheEntry.width;
      canvas.height = cacheEntry.height;
      context.drawImage(image, 0, 0);
      preview.classList.add("loaded");
    };
    image.onerror = function () {
      showFallback(preview);
    };
    image.src = cacheEntry.imageData;
  }

  function showFallback(preview) {
    var fallback = preview.querySelector(".cert-fallback");
    var spinner = preview.querySelector(".cert-spinner");
    var canvas = preview.querySelector("canvas");
    if (spinner) spinner.hidden = true;
    if (canvas) canvas.hidden = true;
    if (fallback) fallback.hidden = false;
    preview.classList.add("loaded");
  }

  function initCertificateReveal(prefersReducedMotion) {
    var cards = document.querySelectorAll(".cert-card");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, revealObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    cards.forEach(function (card) {
      if (isElementInViewport(card)) {
        card.classList.add("is-visible");
      } else {
        observer.observe(card);
      }
    });
  }

  function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * 0.04;
  }

  function getFileType(file) {
    return String(file).split(".").pop().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
