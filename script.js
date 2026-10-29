/* Builds the page from content.js — you normally don't need to edit this file. */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const img = (src, alt, cls) =>
    src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<div class="placeholder ${cls}">IMAGE</div>`;

  // Artists
  $("#artists").innerHTML = SITE.artists.map((a) =>
    `<article class="artist">${img(a.image, a.name, "cover")}<p>${esc(a.name)}</p></article>`).join("");

  // Platforms (two copies so the loop is seamless)
  const group = SITE.platforms.map((p) =>
    `${p.image ? `<img class="logo" src="${esc(p.image)}" alt="${esc(p.name)}">` : `<div class="placeholder logo" title="${esc(p.name)}">LOGO</div>`}<span class="star">✦</span>`).join("");
  $("#marquee").innerHTML = `<div class="group">${group}</div><div class="group" aria-hidden="true">${group}</div>`;

  // Features
  $("#features").innerHTML = SITE.features.map((f) =>
    `<div class="card"><span class="yellow">✦</span><p class="bold">${esc(f.title)}</p><p class="muted small">${esc(f.text)}</p></div>`).join("");

  // Footer links
  $("#footer-links").innerHTML = SITE.footerLinks.map((l) => `<li><a href="${esc(l.link)}">${esc(l.text)}</a></li>`).join("");

  // Socials
  const icons = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 2.9l-.6 1.2a18.3 18.3 0 0 0-5.5 0l-.6-1.2A19.7 19.7 0 0 0 3.7 4.4C.5 9-.3 13.6.1 18a19.9 19.9 0 0 0 6 3l1.3-2a13 13 0 0 1-1.9-.9l.4-.3c3.9 1.8 8.2 1.8 12 0l.4.3a12.3 12.3 0 0 1-1.9.9l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.5-13.7ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
  };
  $("#socials").innerHTML = Object.entries(SITE.socials).filter(([, l]) => l)
    .map(([k, l]) => `<a href="${esc(l)}" aria-label="${k}" target="_blank" rel="noopener">${icons[k] || ""}</a>`).join("");

  // Apply buttons
  document.querySelectorAll("[data-apply]").forEach((b) => {
    b.href = SITE.applyLink; b.target = "_blank"; b.rel = "noopener";
  });

  // Login popup
  const modal = $("#login");
  document.querySelectorAll('[data-open="login"]').forEach((b) => b.addEventListener("click", () => (modal.hidden = false)));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.hidden = true; });
  modal.querySelector("form").addEventListener("submit", (e) => e.preventDefault());

  // Scroll reveal
  const els = document.querySelectorAll("main > section, footer");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  els.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();
