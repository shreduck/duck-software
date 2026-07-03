(function () {
  const carousels = Array.from(document.querySelectorAll("[data-carousel]"));
  if (!carousels.length) {
    return;
  }

  const modal = document.getElementById("carouselModal");
  const modalTitle = document.getElementById("carousel-modal-title");
  const modalImage = document.getElementById("carouselModalImage");
  const modalHtml = document.getElementById("carouselModalHtml");
  const modalCaption = document.getElementById("carouselModalCaption");
  const modalPrev = document.querySelector("[data-carousel-modal-prev]");
  const modalNext = document.querySelector("[data-carousel-modal-next]");

  let modalSlides = [];
  let modalIndex = 0;
  let modalReturnFocus = null;

  function slideData(slide) {
    const image = Array.from(slide.children).find((child) => child.tagName === "IMG");
    const richContent = Array.from(slide.children).find((child) => {
      return child.tagName !== "IMG" && child.tagName !== "FIGCAPTION";
    });
    const caption = slide.querySelector("figcaption");
    if (image) {
      return {
        type: "image",
        src: image.getAttribute("src"),
        alt: image.getAttribute("alt") || "",
        caption: caption ? caption.textContent : ""
      };
    }
    return {
      type: "html",
      content: richContent ? richContent.cloneNode(true) : document.createElement("div"),
      caption: caption ? caption.textContent : ""
    };
  }

  function showModalSlide(index) {
    if (!modal || !modalSlides.length) {
      return;
    }
    modalIndex = (index + modalSlides.length) % modalSlides.length;
    const slide = modalSlides[modalIndex];
    modalImage.hidden = slide.type !== "image";
    modalHtml.hidden = slide.type !== "html";
    modalHtml.replaceChildren();
    if (slide.type === "image") {
      modalImage.src = slide.src;
      modalImage.alt = slide.alt;
    } else {
      modalHtml.append(slide.content.cloneNode(true));
    }
    modalCaption.textContent = slide.caption;
    const singleSlide = modalSlides.length < 2;
    if (modalPrev) {
      modalPrev.hidden = singleSlide;
    }
    if (modalNext) {
      modalNext.hidden = singleSlide;
    }
  }

  function openModal(carousel, index, opener) {
    if (!modal || !modalTitle || !modalImage || !modalHtml || !modalCaption) {
      return;
    }
    const heading = carousel.closest(".feature-card, .workflow-card")?.querySelector("h3")?.textContent || "VeinTrack screenshot";
    modalSlides = Array.from(carousel.querySelectorAll("[data-carousel-slide]")).map(slideData);
    modalReturnFocus = opener;
    modalTitle.textContent = heading;
    modal.hidden = false;
    showModalSlide(index);
    modal.querySelector("button[data-carousel-modal-close]")?.focus();
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.hidden = true;
    modalSlides = [];
    modalHtml?.replaceChildren();
    modalReturnFocus?.focus();
    modalReturnFocus = null;
  }

  function initCarousel(carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    if (!slides.length) {
      return;
    }
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const open = carousel.querySelector("[data-carousel-enlarge]");
    const dots = carousel.querySelector("[data-carousel-dots]");
    let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
    index = index >= 0 ? index : 0;

    function render(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.hidden = !active;
        slide.classList.toggle("is-active", active);
      });
      dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    if (dots) {
      slides.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show screenshot " + (dotIndex + 1));
        dot.addEventListener("click", () => render(dotIndex));
        dots.append(dot);
      });
    }

    prev?.addEventListener("click", () => render(index - 1));
    next?.addEventListener("click", () => render(index + 1));
    open?.addEventListener("click", () => openModal(carousel, index, open));
    render(index);
  }

  carousels.forEach(initCarousel);

  modalPrev?.addEventListener("click", () => showModalSlide(modalIndex - 1));
  modalNext?.addEventListener("click", () => showModalSlide(modalIndex + 1));
  document.querySelectorAll("[data-carousel-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal || modal.hidden) {
      return;
    }
    if (event.key === "Escape") {
      closeModal();
    }
    if (event.key === "ArrowLeft") {
      showModalSlide(modalIndex - 1);
    }
    if (event.key === "ArrowRight") {
      showModalSlide(modalIndex + 1);
    }
  });
})();
