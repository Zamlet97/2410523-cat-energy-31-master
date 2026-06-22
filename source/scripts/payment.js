// source/js/payment.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Получаем корзину из localStorage =====
  const cart = JSON.parse(localStorage.getItem('catEnergyCart')) || {};
  const itemsContainer = document.getElementById('orderItems');
  const totalPriceElement = document.getElementById('totalPrice');

  // ===== Данные о товарах (цены) =====
  const productsData = {
    'Cat Energy PRO 500г': { price: 700 },
    'Cat Energy PRO 1000г': { price: 1000 },
    'Cat Energy PRO 500 г': { price: 700 },
    'Cat Energy PRO 1000г': { price: 1000 },
    'Cat Energy slim 500г': { price: 400 },
    'Cat Energy Slim 1000г': { price: 700 },
    'Cat Energy slim 500г': { price: 500 },
    'Сахарозаменитель': { price: 200 },
    'Питьевая вода': { price: 50 },
    'Молоко': { price: 100 },
    'Витамины': { price: 300 }
  };

  // ===== Функция для отображения заказа =====
  function renderOrder() {
    const items = Object.keys(cart).filter((key) => cart[key] > 0);

    if (items.length === 0) {
      // Корзина пуста — показываем сообщение и кнопку перехода в каталог
      itemsContainer.innerHTML = `
                <p class="payment-page__empty">Корзина пуста. <a href="catalog.html">Перейти в каталог</a></p>
            `;
      totalPriceElement.textContent = '0 ₽';
      document.getElementById('payButton').disabled = true;
      document.getElementById('payButton').style.opacity = '0.5';
      document.getElementById('payButton').textContent = 'Корзина пуста';
      return;
    }

    let total = 0;
    let html = '';

    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0 };
      const itemTotal = productInfo.price * quantity;
      total += itemTotal;

      html += `
                <div class="payment-page__item">
                    <span class="payment-page__item-name">${productName} × ${quantity}</span>
                    <span class="payment-page__item-price">${itemTotal} ₽</span>
                </div>
            `;
    });

    itemsContainer.innerHTML = html;
    totalPriceElement.textContent = `${total} ₽`;

    // Включаем кнопку оплаты
    document.getElementById('payButton').disabled = false;
    document.getElementById('payButton').style.opacity = '1';
    document.getElementById('payButton').textContent = 'Оплатить';
  }

  // ===== Обновляем значок корзины =====
  function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
      cartBadge.textContent = totalCount;
    }
  }

  // ===== Платёжная форма =====
  const payButton = document.getElementById('payButton');

  payButton.addEventListener('click', (e) => {
    e.preventDefault();

    const items = Object.keys(cart).filter((key) => cart[key] > 0);
    if (items.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    // Получаем сумму
    let total = 0;
    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0 };
      total += productInfo.price * quantity;
    });

    // Получаем выбранный способ оплаты
    const paymentType = document.querySelector('input[name="paymentType"]:checked');
    const paymentMethod = paymentType ? paymentType.value : 'AC'; // AC — банковская карта

    // Список товаров для описания платежа
    const itemsList = items.join(', ');

    // ===== СОЗДАНИЕ ПЛАТЕЖНОЙ ФОРМЫ =====
    // Здесь нужно подставить свои параметры:
    // shopId — идентификатор магазина (получить в личном кабинете ЮKassa)
    // scid — идентификатор витрины (получить в личном кабинете ЮKassa)
    // customerNumber — можно передать номер заказа или ID пользователя

    const shopId = 'XXXXXXXX'; // ЗАМЕНИТЕ НА СВОЙ shopId
    const scid = 'XXXXXXXX'; // ЗАМЕНИТЕ НА СВОЙ scid

    if (shopId === 'XXXXXXXX' || scid === 'XXXXXXXX') {
      alert('⚠️ Платёжная система ещё не настроена.\n\n' +
                  'Для интеграции с YooMoney нужно:\n' +
                  '1. Зарегистрироваться в ЮKassa\n' +
                  '2. Получить shopId и scid\n' +
                  '3. Подставить их в код на странице payment.html');
      return;
    }

    // Формируем HTML-форму для отправки на YooMoney
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://yoomoney.ru/eshop.xml';
    form.target = '_blank'; // Откроется в новой вкладке

    // Параметры формы
    const params = {
      'shopId': shopId,
      'scid': scid,
      'sum': total.toFixed(2),
      'customerNumber': `user_${ Date.now()}`,
      'orderDetails': `Заказ в Cat Energy: ${itemsList}`,
      'paymentType': paymentMethod,
      // Дополнительные поля для информации о покупателе (опционально)
      // 'custName': 'Имя покупателя',
      // 'custEmail': 'email@example.com',
    };

    // Добавляем все параметры в форму
    for (const [key, value] of Object.entries(params)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    // Добавляем форму на страницу и отправляем
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  });

  // ===== Инициализация =====
  renderOrder();
  updateCartBadge();
});
