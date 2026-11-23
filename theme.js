(() => {
  const key = "duck-code-theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let choice;
  function readChoice() {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function paint() {
    const dark = choice === "dark" || (choice !== "light" && system.matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute("aria-pressed", String(dark));
    }
  }
  function sync() { choice = readChoice(); paint(); }
  sync();
  document.addEventListener("DOMContentLoaded", () => {
    paint();
    document.querySelector(".theme-toggle")?.addEventListener("click", () => {
      choice = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, choice); } catch { /* Keep the preference for this page. */ }
      paint();
    });
  });
  system.addEventListener("change", paint);
  window.addEventListener("storage", event => { if (!event.key || event.key === key) sync(); });
  window.addEventListener("pageshow", event => { if (event.persisted) sync(); });
})();
