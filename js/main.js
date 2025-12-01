(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);

  // footer year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ===== Sticky header show/hide =====
  const header = $("#stickyHeader");
  const sentinel = $("#stickySentinel");

  if (header && sentinel && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // sentinel が見えている = まだヒーロー内 => ヘッダー隠す
        // sentinel が見えない = ヒーローを抜けた => ヘッダー表示
        header.classList.toggle("is-visible", !e.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );
    obs.observe(sentinel);
  }

  // ===== Carousel =====
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-track]");
  const prev  = root.querySelector("[data-prev]");
  const next  = root.querySelector("[data-next]");
  const dotsC = root.querySelector("[data-dots]");

  const cards = Array.from(track.querySelectorAll(".card"));
  if (!cards.length) return;

  const dots = cards.map((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " is-active" : "");
    d.setAttribute("role", "button");
    d.setAttribute("tabindex", "0");
    d.setAttribute("aria-label", `スライド ${i + 1}`);
    d.addEventListener("click", () => scrollToIndex(i));
    d.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") scrollToIndex(i);
    });
    dotsC.appendChild(d);
    return d;
  });

  function cardStepPx() {
    const first = cards[0];
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function scrollToIndex(i) {
    const idx = Math.max(0, Math.min(cards.length - 1, i));
    const x = idx * cardStepPx();
    track.scrollTo({ left: x, behavior: "smooth" });
  }

  function activeIndex() {
    const step = cardStepPx();
    return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step)));
  }

  function paintDots() {
    const idx = activeIndex();
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }

  prev?.addEventListener("click", () => scrollToIndex(activeIndex() - 1));
  next?.addEventListener("click", () => scrollToIndex(activeIndex() + 1));

  let raf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(paintDots);
  }, { passive: true });

  paintDots();
})();
