const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primary-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const year = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const productButtons = document.querySelectorAll("[data-product-target]");
const productCards = document.querySelectorAll("[data-product-card]");
const productDetails = document.querySelectorAll("[data-product-detail]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    });
  });
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Thank you. Apex Power Systems will review your inquiry and respond shortly.";
    contactForm.reset();
  });
}

if (productButtons.length && productDetails.length) {
  productButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.productTarget;

      productButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      productCards.forEach((card) => {
        card.classList.toggle("is-active", card.dataset.productCard === target);
      });

      productDetails.forEach((detail) => {
        detail.classList.toggle("is-active", detail.dataset.productDetail === target);
      });
    });
  });
}
