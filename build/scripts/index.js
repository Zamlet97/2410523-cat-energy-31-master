// source/scripts/index.js
document.addEventListener("DOMContentLoaded", () => {
  const burgerButton = document.querySelector(".navigation__button-close");
  const navMenu = document.querySelector(".navigation__menu");
  if (burgerButton && navMenu) {
    burgerButton.addEventListener("click", function() {
      navMenu.classList.toggle("navigation__menu--open");
      navMenu.classList.toggle("navigation__menu--close");
      const isOpen = navMenu.classList.contains("navigation__menu--open");
      this.setAttribute("aria-label", isOpen ? "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E" : "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E");
    });
    const navLinks = navMenu.querySelectorAll(".navigation__menu-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("navigation__menu--open");
        navMenu.classList.add("navigation__menu--close");
        burgerButton.textContent = "\u2630";
        burgerButton.setAttribute("aria-label", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E");
      });
    });
  }
});
//# sourceMappingURL=index.js.map
