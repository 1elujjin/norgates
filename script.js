/* Builds the page from content.js — you normally don't need to edit this file. */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const img = (src, alt, cls, label) =>
    src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<div class="placeholder ${cls}">${label || "IMAGE"}</div>`;

  /* ---------- Artists: endless rail, arrows scroll it both ways ---------- */
  const ARTIST_COPIES = 7;   // copies of the artist list rendered in the track
  const CARD_GAP = 12;       // space between artist cards (px)
  const STEP_MS = 650;       // how long one animated scroll takes
  const SET = SITE.artists.length;
  const START_POS = Math.floor(ARTIST_COPIES / 2) * SET;
  const LOWER = 1;
  const UPPER = ARTIST_COPIES * SET - 8;

  const rail = $("#artists");
  const track = $("#artists-track");
  let step = 0, pos = START_POS, anim = false, safety = 0;

  track.innerHTML = Array.from({ length: ARTIST_COPIES }, (_, c) =>
    `<div class="copy"${c > 0 ? ' aria-hidden="true"' : ""}>${SITE.artists.map((a) =>
      `<article class="artist">${img(a.image, a.name, "cover", "IMAGE")}<p>${esc(a.name)}</p></article>`).join("")}</div>`).join("");

  const paint = () => {
    track.style.transition = anim ? `transform ${STEP_MS}ms cubic-bezier(.22,1,.36,1)` : "none";
    track.style.transform = `translate3d(${-(pos * step + step / 2)}px,0,0)`;
  };

  /* shift by whole copies until the position sits inside the safe band */
  const wrap = (p) => {
    let q = p;
    while (q > UPPER) q -= SET;
    while (q < LOWER) q += SET;
    return q;
  };

  const move = (dir) => {
    const cur = pos;
    const next = cur + dir;
    if (next > UPPER || next < LOWER) {
      /* hop one copy back (invisible), then animate from there */
      const base = next > UPPER ? cur - SET : cur + SET;
      anim = false; pos = base; paint();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        anim = true; pos = base + dir; paint();
      }));
    } else {
      anim = true; pos = next; paint();
    }
    /* safety net: if the position ever drifts out of the band, shift it back silently */
    clearTimeout(safety);
    safety = setTimeout(() => {
      const w = wrap(pos);
      if (w === pos) return;
      anim = false; pos = w; paint();
      requestAnimationFrame(() => requestAnimationFrame(() => { anim = true; paint(); }));
    }, STEP_MS + 60);
  };

  const measure = () => {
    const card = rail.querySelector(".artist");
    if (card) { step = card.offsetWidth + CARD_GAP; paint(); }
  };
  measure();
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(rail);
  else window.addEventListener("resize", measure);

  document.querySelector(".scroller.prev").addEventListener("click", () => move(-1));
  document.querySelector(".scroller.next").addEventListener("click", () => move(1));

  /* ---------- Platforms: keep the strip looping forever at a steady speed ---------- */
  const MARQUEE_COPIES = 6;
  const MARQUEE_SPEED = 14;   // px per second
  const marquee = $("#marquee");
  const group = SITE.platforms.map((p) =>
    `${p.image ? `<img class="logo" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="placeholder logo" title="${esc(p.name)}">LOGO</div>`}<span class="star">✦</span>`).join("");
  marquee.innerHTML = Array.from({ length: MARQUEE_COPIES }, (_, i) =>
    `<div class="group"${i > 0 ? ' aria-hidden="true"' : ""}>${group}</div>`).join("");

  const tune = () => {
    const half = marquee.scrollWidth / 2;
    if (half > 0) marquee.style.animationDuration = `${Math.round(half / MARQUEE_SPEED)}s`;
  };
  tune();
  if ("ResizeObserver" in window) new ResizeObserver(tune).observe(marquee);
  window.addEventListener("load", tune);

  /* ---------- Features ---------- */
  $("#features").innerHTML = SITE.features.map((f) =>
    `<div class="card"><span class="yellow">✦</span><p class="bold">${esc(f.title)}</p><p class="muted small">${esc(f.text)}</p></div>`).join("");

  /* ---------- Footer links ---------- */
  $("#footer-links").innerHTML = SITE.footerLinks.map((l) => `<li><a href="${esc(l.link)}">${esc(l.text)}</a></li>`).join("");

  /* ---------- Socials ---------- */
  const icons = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 2.9l-.6 1.2a18.3 18.3 0 0 0-5.5 0l-.6-1.2A19.7 19.7 0 0 0 3.7 4.4C.5 9-.3 13.6.1 18a19.9 19.9 0 0 0 6 3l1.3-2a13 13 0 0 1-1.9-.9l.4-.3c3.9 1.8 8.2 1.8 12 0l.4.3a12.3 12.3 0 0 1-1.9.9l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.5-13.7ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
  };
  $("#socials").innerHTML = Object.entries(SITE.socials).filter(([, l]) => l)
    .map(([k, l]) => `<a href="${esc(l)}" aria-label="${k}" target="_blank" rel="noopener">${icons[k] || ""}</a>`).join("");

  /* ---------- Apply / Login buttons ---------- */
  document.querySelectorAll("[data-apply]").forEach((b) => {
    b.href = SITE.applyLink; b.target = "_blank"; b.rel = "noopener";
  });
  document.querySelectorAll("[data-login]").forEach((b) => {
    b.href = SITE.loginLink; b.target = "_blank"; b.rel = "noopener";
  });

  /* ---------- Scroll reveal ---------- */
  const els = document.querySelectorAll("main > section, footer");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  els.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();
