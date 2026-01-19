/* Flor F - script.js (limpo) */
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) Overlay / Desbloqueio
  // =========================
  const overlay = document.querySelector(".overlay");
  const sunflowerBtn = document.querySelector(".sunflower");
  const content = document.querySelector("#content");

  function unlockSite() {
    // anima o girassol (se existir)
    if (sunflowerBtn) sunflowerBtn.classList.add("sunflower--spin");

    // tira o lock do conteúdo
    if (content) {
      content.classList.remove("content--locked");
      content.removeAttribute("aria-hidden");
    }

    // esconde overlay com animação
    if (overlay) {
      overlay.classList.add("overlay--hide");
      // depois remove mesmo (para não bloquear cliques)
      setTimeout(() => overlay.remove(), 750);
    }
  }

  if (sunflowerBtn) {
    sunflowerBtn.addEventListener("click", unlockSite);
    sunflowerBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        unlockSite();
      }
    });
  }

  // ======================================
  // 2) Scroll suave para anchors (#secções)
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

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = "none";
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  // suporta a tua galeria antiga com botões .gallery__item + data-full
  document.querySelectorAll(".gallery__item[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-full");
      if (src) openLightbox(src);
    });
  });

  // fechar lightbox
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // fecha ao clicar fora da imagem
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // =========================
  // 4) Carrossel (autoplay)
  // =========================
  const track = document.querySelector(".carousel__track");
  const carousel = document.querySelector(".carousel");
  const slides = track ? Array.from(track.querySelectorAll(".carousel__slide")) : [];

  if (track && slides.length > 1) {
    let index = 0;
    let timer = null;

    const INTERVAL_MS = 6500;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const start = () => {
      stop();
      timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    // autoplay
    start();

    // pausa no hover (desktop)
    if (carousel) {
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
    }

    // swipe (mobile)
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
      const threshold = 40;

      if (dx > threshold) goTo(index - 1);
      else if (dx < -threshold) goTo(index + 1);
      else goTo(index);

      start();
    };

    if (carousel) {
      carousel.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
      carousel.addEventListener("touchend", (e) => onUp(e.changedTouches[0].clientX), { passive: true });

      // também funciona com mouse (arrastar) se quiseres
      carousel.addEventListener("mousedown", (e) => onDown(e.clientX));
      window.addEventListener("mouseup", (e) => onUp(e.clientX));
    }

    // evita “saltos” se o user mudar de tab e voltar
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }
});
