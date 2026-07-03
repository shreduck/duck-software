(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const selector = [
    ".feature-card",
    ".workflow-card",
    ".trust-banner",
    ".widget-preview",
    ".live-activity-preview"
  ].join(",");

  let cards = [];
  let frame = 0;

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function refreshCards() {
    cards = Array.from(document.querySelectorAll(selector)).filter((card) => {
      return !card.closest(".section-index");
    });
    cards.forEach((card) => card.classList.add("scroll-focus-card"));
  }

  function resetCards() {
    document.documentElement.classList.remove("scroll-focus-enabled");
    cards.forEach((card) => {
      card.classList.remove("scroll-focus-card");
      card.style.removeProperty("--scroll-focus");
      card.style.removeProperty("--scroll-scale");
      card.style.removeProperty("--scroll-blur");
    });
  }

  function updateCards() {
    frame = 0;

    if (reducedMotion.matches) {
      resetCards();
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportCenterY = viewportHeight / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      const visibleRatio = clamp((visibleWidth * visibleHeight) / (rect.width * rect.height));

      const cardCenterY = rect.top + rect.height / 2;
      const centerDistance = Math.abs(cardCenterY - viewportCenterY);
      const focusRange = Math.max(viewportHeight * 0.62, rect.height * 1.05);
      const centerScore = clamp(1 - centerDistance / focusRange);

      const rawFocus = centerScore * 0.72 + visibleRatio * 0.28;
      const focus = clamp(Math.max(0.18, rawFocus));
      const scale = 0.982 + focus * 0.018;
      const blur = (1 - focus) * 0.42;

      card.style.setProperty("--scroll-focus", focus.toFixed(3));
      card.style.setProperty("--scroll-scale", scale.toFixed(4));
      card.style.setProperty("--scroll-blur", `${blur.toFixed(2)}px`);
    });
  }

  function scheduleUpdate() {
    if (!frame) {
      frame = window.requestAnimationFrame(updateCards);
    }
  }

  function enable() {
    if (reducedMotion.matches) {
      resetCards();
      return;
    }

    document.documentElement.classList.add("scroll-focus-enabled");
    refreshCards();
    scheduleUpdate();
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("load", enable, { once: true });
  window.addEventListener("pageshow", enable);
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", enable);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(enable);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enable, { once: true });
  } else {
    enable();
  }
})();
