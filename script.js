/* Flor F - script.js (limpo/optimizado) */
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) Overlay / Desbloqueio
  // =========================
  const overlay = document.querySelector(".overlay");
  const sunflowerBtn = document.querySelector(".sunflower");
  const content = document.querySelector("#content");

  const unlockSite = () => {
    if (sunflowerBtn) sunflowerBtn.classList.add("sunflower--spin");

    if (content) {
      content.classList.remove("content--locked");
      content.removeAttribute("aria-hidden");
    }

    if (overlay) {
      overlay.classList.add("overlay--hide");
      setTimeout(() => overlay.remove(), 750);
    }
  };

  if (sunflowerBtn) {
    sunflowerBtn.addEventListener("click", unlockSite, { once: true });
    sunflowerBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        unlockSite();
      }
    });
  }

  // ======================================
  // 2) Scroll suave para anchors internas
  // ======================================
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // =========================
  // 3) Lightbox (se existir)
  // =========================
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox__close") : null;

  const openLightbox = (src) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = "none";
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".gallery__item[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-full");
      if (src) openLightbox(src);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // =========================
  // 4) Carrossel (autoplay + swipe)
  // =========================
  const carousel = document.querySelector(".carousel");
  const track = document.querySelector(".carousel__track");
  const slides = track ? Array.from(track.querySelectorAll(".carousel__slide")) : [];

  if (carousel && track && slides.length > 1) {
    let index = 0;
    let timer = null;

    const INTERVAL_MS = 6500;
    const threshold = 40;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
    };

    // autoplay
    start();

    // pause no hover (desktop)
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    // swipe / drag (pointer events = mobile + desktop)
    let startX = 0;
    let dragging = false;

    const onDown = (x) => {
      dragging = true;
      startX = x;
      stop();
    };

    const onUp = (x) => {
      if (!dragging) return;
      dragging = false;

      const dx = x - startX;
      if (dx > threshold) goTo(index - 1);
      else if (dx < -threshold) goTo(index + 1);
      else goTo(index);

      start();
    };

    // pointer (melhor)
    carousel.addEventListener("pointerdown", (e) => onDown(e.clientX));
    window.addEventListener("pointerup", (e) => onUp(e.clientX));

    // fallback touch (caso algum browser seja esquisito)
    carousel.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
    carousel.addEventListener("touchend", (e) => onUp(e.changedTouches[0].clientX), { passive: true });

    // evita “saltos” ao mudar de tab
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }

  // =========================
  // 5) Ano automático no footer
  // =========================
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
