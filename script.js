document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Roster (placeholder names — replace with real artists) ---------- */
  const roster = [
    { name: "Laylo!!", url: "https://open.spotify.com/artist/0YBxMclvsTziVtgFLvyQMc" },
    { name: "lungskull", url: "https://open.spotify.com/artist/2wvTwsc93H5xfsHE6QK1nl" },
    { name: "korpsebunny", url: "https://open.spotify.com/artist/6T04hB7RDjKLHA6SRfxoNK" },
    { name: "up!r", url: "https://open.spotify.com/artist/1GUHKMXKOywHEOIa8zShNm" },
    { name: "yom", url: "https://open.spotify.com/artist/5XnKVa2rVk57rKZwcJ1zew" },
    { name: "backrooms", url: "https://open.spotify.com/artist/625NGrk7swcona2P7GeQEB" },
    { name: "pupsies", url: "https://open.spotify.com/track/6De8sirPzVyAoBDlQpcutY" },
    { name: "girled", url: "https://open.spotify.com/artist/0SXu7XTzCuR4CQFc0CILfq" },
  ];

  const list = document.getElementById("rosterList");
  roster.forEach((artist, i) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = artist.url;
    a.textContent = artist.name;
    li.appendChild(a);
    if (i < roster.length - 1) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "/";
      li.appendChild(sep);
    }
    list.appendChild(li);
  });

  /* ---------- Title: split into letters that slide up one by one ---------- */
  const title = document.querySelector(".title");
  const text = title.textContent;
  title.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", i);
    span.textContent = ch === " " ? " " : ch;
    title.appendChild(span);
  });

  /* ---------- Staggered load-in ---------- */
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${300 + i * 110}ms`;
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add("is-loaded"))
  );
});