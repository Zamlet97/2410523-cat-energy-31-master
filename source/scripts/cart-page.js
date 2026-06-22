// source/js/cart-page.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Получаем данные из localStorage =====
  const cart = JSON.parse(localStorage.getItem('catEnergyCart')) || {};
  const cartList = document.getElementById('cartList');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  const totalPriceElement = document.getElementById('totalPrice');

  // ===== Данные о товарах (цены и изображения) =====
  const productsData = {
    'Cat Energy PRO 500г': { price: 700, image: 'images/products/product-1/product-mobile-1@2x.png' },
    'Cat Energy PRO 1000г': { price: 1000, image: 'images/products/product-2/product-mobile-2@2x.png' },
    'Cat Energy PRO 500 г': { price: 700, image: 'images/products/product-3/product-mobile-3@2x.png' },
    'Cat Energy PRO 1000г': { price: 1000, image: 'images/products/product-4/product-mobile-4@2x.png' },
    'Cat Energy slim 500г': { price: 400, image: 'images/products/product-5/product-mobile-5@2x.png' },
    'Cat Energy Slim 1000г': { price: 700, image: 'images/products/product-6/product-mobile-6@2x.png' },
    'Cat Energy slim 500г': { price: 500, image: 'images/products/product-7/product-mobile-7@2x.png' },
    'Сахарозаменитель': { price: 200, image: '' },
    'Питьевая вода': { price: 50, image: '' },
    'Молоко': { price: 100, image: '' },
    'Витамины': { price: 300, image: '' }
  };

  // ===== Функция для обновления значка корзины =====
  function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
      cartBadge.textContent = totalCount;
    }
  }

  // ===== Функция для отображения товаров в корзине =====
  function renderCart() {
    const items = Object.keys(cart).filter((key) => cart[key] > 0);

    if (items.length === 0) {
      // Корзина пуста
      emptyCart.style.display = 'block';
      cartList.style.display = 'none';
      cartSummary.style.display = 'none';
      updateCartBadge();
      return;
    }

    // Показываем список
    emptyCart.style.display = 'none';
    cartList.style.display = 'flex';
    cartSummary.style.display = 'flex';

    // Очищаем список
    cartList.innerHTML = '';

    let total = 0;

    // Добавляем каждый товар
    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0, image: '' };
      const price = productInfo.price;
      const totalPrice = price * quantity;
      total += totalPrice;

      const itemElement = document.createElement('div');
      itemElement.className = 'cart-page__item';
      itemElement.dataset.product = productName;

      itemElement.innerHTML = `
                <img class="cart-page__item-image" src="${productInfo.image || 'images/logo/logo-mobile.svg'}" alt="${productName}" loading="lazy">
                <div class="cart-page__item-info">
                    <a href="#" class="cart-page__item-title">${productName}</a>
                    <div class="cart-page__item-details">
                        <span>💰 ${price} ₽ / шт.</span>
                    </div>
                </div>
                <div class="cart-page__item-counter">
                    <button class="counter-button counter-button--minus" type="button">−</button>
                    <span class="counter-value">${quantity}</span>
                    <button class="counter-button counter-button--plus" type="button">+</button>
                </div>
                <span class="cart-page__item-price">${totalPrice} ₽</span>
                <button class="cart-page__item-remove" type="button" aria-label="Удалить товар">✕</button>
            `;

      cartList.appendChild(itemElement);

      // ===== Обработчики для кнопок в корзине =====
      const minusBtn = itemElement.querySelector('.counter-button--minus');
      const plusBtn = itemElement.querySelector('.counter-button--plus');
      const counterValue = itemElement.querySelector('.counter-value');
      const removeBtn = itemElement.querySelector('.cart-page__item-remove');

      // Обновление количества
      function updateQuantity(newQuantity) {
        if (newQuantity <= 0) {
          delete cart[productName];
          // Анимация удаления
          itemElement.style.transform = 'scale(0.8)';
          itemElement.style.opacity = '0';
          setTimeout(() => {
            renderCart();
          }, 300);
        } else {
          cart[productName] = newQuantity;
          counterValue.textContent = newQuantity;
          // Обновляем цену
          const priceElement = itemElement.querySelector('.cart-page__item-price');
          priceElement.textContent = `${newQuantity * price} ₽`;
          // Обновляем итог
          updateTotal();
          // Сохраняем в localStorage
          localStorage.setItem('catEnergyCart', JSON.stringify(cart));
          updateCartBadge();
        }
      }

      plusBtn.addEventListener('click', () => {
        const current = parseInt(counterValue.textContent, 10) || 0;
        updateQuantity(current + 1);
      });

      minusBtn.addEventListener('click', () => {
        const current = parseInt(counterValue.textContent, 10) || 0;
        updateQuantity(current - 1);
      });

      removeBtn.addEventListener('click', () => {
        updateQuantity(0);
      });
    });

    // Обновляем итоговую сумму
    updateTotal();
    updateCartBadge();
  }

  // ===== Функция обновления итоговой суммы =====
  function updateTotal() {
    const items = Object.keys(cart).filter((key) => cart[key] > 0);
    let total = 0;

    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0 };
      total += productInfo.price * quantity;
    });

    totalPriceElement.textContent = `${total} ₽`;
  }

  // ===== Обработчик для кнопки "Оформить заказ" =====
  const checkoutButton = document.getElementById('checkoutButton');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const items = Object.keys(cart).filter((key) => cart[key] > 0);
      if (items.length === 0) {
        alert('Корзина пуста!');
        return;
      }

      // Переход на страницу оплаты
      window.location.href = 'payment.html';
    });
  }

  // ===== Рендерим корзину при загрузке =====
  renderCart();
});
