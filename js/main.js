(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // drawer
  const hamburger = $(".hamburger");
  const drawer = $(".drawer");

  const setDrawer = (open) => {
    if (!drawer || !hamburger) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(open));
  };

  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      const open = !drawer.classList.contains("open");
      setDrawer(open);
    });

    // close drawer when clicking a link
    $$(".drawer a").forEach(a => {
      a.addEventListener("click", () => setDrawer(false));
    });

    // close on escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setDrawer(false);
    });
  }

  // reveal on scroll
  const targets = $$(".reveal");
  if (targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    }, { threshold: 0.15 });

    targets.forEach(t => io.observe(t));
  }

  // subtle parallax for glows
  const glows = $$(".glow");
  if (glows.length) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      glows.forEach((g, i) => {
        const m = (i % 2 === 0) ? 10 : 14;
        g.style.transform = `translate(${x * m}px, ${y * m}px)`;
      });
    }, { passive: true });
  }
})();
