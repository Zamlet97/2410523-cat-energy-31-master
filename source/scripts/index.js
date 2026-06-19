document.addEventListener('DOMContentLoaded', () => {
  // ========== БУРГЕР-МЕНЮ ==========
  const burgerButton = document.querySelector('.navigation__button-close');
  const navMenu = document.querySelector('.navigation__menu');

  if (burgerButton && navMenu) {
    // Открытие/закрытие по клику на кнопку
    burgerButton.addEventListener('click', function() {
      // Переключаем класс для меню
      navMenu.classList.toggle('navigation__menu--open');
      navMenu.classList.toggle('navigation__menu--close');

      // Меняем текст кнопки
      const isOpen = navMenu.classList.contains('navigation__menu--open');
      this.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрытие меню по клику на ссылку
    const navLinks = navMenu.querySelectorAll('.navigation__menu-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('navigation__menu--open');
        navMenu.classList.add('navigation__menu--close');
        burgerButton.textContent = '☰';
        burgerButton.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }
});
