// source/scripts/cart.js
document.addEventListener("DOMContentLoaded", () => {
  const cartBadge = document.getElementById("cartBadge");
  const cart = JSON.parse(localStorage.getItem("catEnergyCart")) || {};
  function showNotification(message, isAdding = true) {
    const oldNotification = document.querySelector(".cart-notification");
    if (oldNotification) {
      oldNotification.remove();
    }
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
      notification.classList.add("is-visible");
    });
    setTimeout(() => {
      notification.classList.remove("is-visible");
      notification.classList.add("is-hidden");
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 2e3);
  }
  function updateCartBadge(animate = false) {
    const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    if (cartBadge) {
      const currentCount = parseInt(cartBadge.textContent, 10) || 0;
      cartBadge.textContent = totalCount;
      if (animate && totalCount > 0 && totalCount !== currentCount) {
        cartBadge.classList.remove("is-bouncing");
        void cartBadge.offsetWidth;
        cartBadge.classList.add("is-bouncing");
        setTimeout(() => {
          cartBadge.classList.remove("is-bouncing");
        }, 500);
      }
      if (totalCount === 0) {
        cartBadge.style.opacity = "0";
        setTimeout(() => {
          cartBadge.style.opacity = "1";
        }, 100);
      }
    }
    localStorage.setItem("catEnergyCart", JSON.stringify(cart));
  }
  const productCards = document.querySelectorAll(".product-card:not(.product-card--other)");
  productCards.forEach((card) => {
    const orderButton = card.querySelector(".product-card__button.button--primary");
    const productTitleElement = card.querySelector(".product-card__link--title");
    const productId = productTitleElement ? productTitleElement.textContent.trim() : "\u0422\u043E\u0432\u0430\u0440";
    const counterWrapper = document.createElement("div");
    counterWrapper.className = "product-card__counter";
    const initialValue = cart[productId] || 0;
    counterWrapper.innerHTML = `
            <button class="counter-button counter-button--minus" type="button">\u2212</button>
            <span class="counter-value">${initialValue}</span>
            <button class="counter-button counter-button--plus" type="button">+</button>
        `;
    orderButton.parentNode.insertBefore(counterWrapper, orderButton.nextSibling);
    const minusButton = counterWrapper.querySelector(".counter-button--minus");
    const plusButton = counterWrapper.querySelector(".counter-button--plus");
    const counterValue = counterWrapper.querySelector(".counter-value");
    function updateCounter(newValue, animate = false) {
      if (newValue < 0) {
        newValue = 0;
      }
      const oldValue = parseInt(counterValue.textContent, 10) || 0;
      counterValue.textContent = newValue;
      if (animate && newValue !== oldValue) {
        counterValue.classList.remove("is-changing");
        void counterValue.offsetWidth;
        counterValue.classList.add("is-changing");
        setTimeout(() => {
          counterValue.classList.remove("is-changing");
        }, 200);
      }
      if (newValue === 0) {
        delete cart[productId];
        counterWrapper.classList.remove("is-active");
        counterWrapper.classList.add("is-removing");
        orderButton.classList.remove("product-card__button--hidden");
        setTimeout(() => {
          counterWrapper.classList.remove("is-removing");
        }, 300);
        showNotification(`\u274C ${productId} \u0443\u0434\u0430\u043B\u0435\u043D \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B`, false);
      } else {
        cart[productId] = newValue;
        counterWrapper.classList.add("is-active");
        orderButton.classList.add("product-card__button--hidden");
        if (oldValue === 0) {
          showNotification(`\u2705 ${productId} \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443`);
        }
      }
      updateCartBadge(true);
    }
    orderButton.addEventListener("click", (e) => {
      e.preventDefault();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue + 1, true);
    });
    plusButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue + 1, true);
    });
    minusButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentValue = parseInt(counterValue.textContent, 10) || 0;
      updateCounter(currentValue - 1, true);
    });
    if (cart[productId] && cart[productId] > 0) {
      counterValue.textContent = cart[productId];
      counterWrapper.classList.add("is-active");
      orderButton.classList.add("product-card__button--hidden");
    } else {
      counterWrapper.classList.remove("is-active");
      orderButton.classList.remove("product-card__button--hidden");
    }
  });
  updateCartBadge(false);
});
//# sourceMappingURL=cart.js.map
