// source/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Инициализация корзины =====
  const cartBadge = document.getElementById('cartBadge');
  const cart = JSON.parse(localStorage.getItem('catEnergyCart')) || {};

  // ===== Функция создания уведомления =====
  // eslint-disable-next-line no-unused-vars
  function showNotification(message, isAdding = true) {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector('.cart-notification');
    if (oldNotification) {
      oldNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Показываем с анимацией
    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });

    // Скрываем через 2 секунды
    setTimeout(() => {
      notification.classList.remove('is-visible');
      notification.classList.add('is-hidden');
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 2000);
  }

  // ===== Функция обновления значка корзины =====
  function updateCartBadge(animate = false) {
    const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

    if (cartBadge) {
      const currentCount = parseInt(cartBadge.textContent, 10) || 0;
      cartBadge.textContent = totalCount;

      if (animate && totalCount > 0 && totalCount !== currentCount) {
        // Анимация пульсации при изменении
        cartBadge.classList.remove('is-bouncing');
        // Триггер перерисовки
        void cartBadge.offsetWidth;
        cartBadge.classList.add('is-bouncing');

        // Убираем класс после анимации
        setTimeout(() => {
          cartBadge.classList.remove('is-bouncing');
        }, 500);
      }

      // Показываем/скрываем значок
      if (totalCount === 0) {
        cartBadge.style.opacity = '0';
        setTimeout(() => {
          cartBadge.style.opacity = '1';
        }, 100);
      }
    }

    localStorage.setItem('catEnergyCart', JSON.stringify(cart));
  }

  // ===== Обработка каждой карточки товара =====
  const productCards = document.querySelectorAll('.product-card:not(.product-card--other)');

  productCards.forEach((card) => {
    const orderButton = card.querySelector('.product-card__button.button--primary');
    const productTitleElement = card.querySelector('.product-card__link--title');
    const productId = productTitleElement ? productTitleElement.textContent.trim() : 'Товар';

    // Создаем блок счетчика
    const counterWrapper = document.createElement('div');
    counterWrapper.className = 'product-card__counter';
    const initialValue = cart[productId] || 0;
    counterWrapper.innerHTML = `
            <button class="counter-button counter-button--minus" type="button">−</button>
            <span class="counter-value">${initialValue}</span>
            <button class="counter-button counter-button--plus" type="button">+</button>
        `;

    orderButton.parentNode.insertBefore(counterWrapper, orderButton.nextSibling);

    const minusButton = counterWrapper.querySelector('.counter-button--minus');
    const plusButton = counterWrapper.querySelector('.counter-button--plus');
    const counterValue = counterWrapper.querySelector('.counter-value');

    // ===== Функция обновления счетчика и корзины =====
    function updateCounter(newValue, animate = false) {
      if (newValue < 0) {
        newValue = 0;
      }
      const oldValue = parseInt(counterValue.textContent, 10) || 0;

      // Обновляем значение
      counterValue.textContent = newValue;

      // Анимация числа
      if (animate && newValue !== oldValue) {
        counterValue.classList.remove('is-changing');
        void counterValue.offsetWidth;
        counterValue.classList.add('is-changing');
        setTimeout(() => {
          counterValue.classList.remove('is-changing');
        }, 200);
      }

      if (newValue === 0) {
        // Удаляем товар из корзины с анимацией исчезновения
        delete cart[productId];
        counterWrapper.classList.remove('is-active');
        counterWrapper.classList.add('is-removing');
        orderButton.classList.remove('product-card__button--hidden');

        setTimeout(() => {
          counterWrapper.classList.remove('is-removing');
        }, 300);

        // Показываем уведомление об удалении
        showNotification(`❌ ${productId} удален из корзины`, false);
      } else {
        // Добавляем или обновляем товар
        cart[productId] = newValue;
        counterWrapper.classList.add('is-active');
        orderButton.classList.add('product-card__button--hidden');

        // Показываем уведомление только при добавлении
        if (oldValue === 0) {
          showNotification(`✅ ${productId} добавлен в корзину`);
        }
      }

      updateCartBadge(true);
    }

    // ===== Обработчики событий =====
    orderButton.addEventListener('click', (e) => {
      e.preventDefault();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue + 1, true);
    });

    plusButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue + 1, true);
    });

    minusButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue - 1, true);
    });

    // Восстанавливаем состояние при загрузке страницы
    if (cart[productId] && cart[productId] > 0) {
      counterValue.textContent = cart[productId];
      counterWrapper.classList.add('is-active');
      orderButton.classList.add('product-card__button--hidden');
    } else {
      counterWrapper.classList.remove('is-active');
      orderButton.classList.remove('product-card__button--hidden');
    }
  });

  // ===== Обновляем значок корзины при загрузке =====
  updateCartBadge(false);
});
