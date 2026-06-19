// source/scripts/cart-page.js
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("catEnergyCart")) || {};
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");
  const totalPriceElement = document.getElementById("totalPrice");
  const productsData = {
    "Cat Energy PRO 500\u0433": { price: 700, image: "images/products/product-1/product-mobile-1@2x.png" },
    "Cat Energy PRO 1000\u0433": { price: 1e3, image: "images/products/product-2/product-mobile-2@2x.png" },
    "Cat Energy PRO 500 \u0433": { price: 700, image: "images/products/product-3/product-mobile-3@2x.png" },
    "Cat Energy PRO 1000\u0433": { price: 1e3, image: "images/products/product-4/product-mobile-4@2x.png" },
    "Cat Energy slim 500\u0433": { price: 400, image: "images/products/product-5/product-mobile-5@2x.png" },
    "Cat Energy Slim 1000\u0433": { price: 700, image: "images/products/product-6/product-mobile-6@2x.png" },
    "Cat Energy slim 500\u0433": { price: 500, image: "images/products/product-7/product-mobile-7@2x.png" },
    "\u0421\u0430\u0445\u0430\u0440\u043E\u0437\u0430\u043C\u0435\u043D\u0438\u0442\u0435\u043B\u044C": { price: 200, image: "" },
    "\u041F\u0438\u0442\u044C\u0435\u0432\u0430\u044F \u0432\u043E\u0434\u0430": { price: 50, image: "" },
    "\u041C\u043E\u043B\u043E\u043A\u043E": { price: 100, image: "" },
    "\u0412\u0438\u0442\u0430\u043C\u0438\u043D\u044B": { price: 300, image: "" }
  };
  function updateCartBadge() {
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
      const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
      cartBadge.textContent = totalCount;
    }
  }
  function renderCart() {
    const items = Object.keys(cart).filter((key) => cart[key] > 0);
    if (items.length === 0) {
      emptyCart.style.display = "block";
      cartList.style.display = "none";
      cartSummary.style.display = "none";
      updateCartBadge();
      return;
    }
    emptyCart.style.display = "none";
    cartList.style.display = "flex";
    cartSummary.style.display = "flex";
    cartList.innerHTML = "";
    let total = 0;
    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0, image: "" };
      const price = productInfo.price;
      const totalPrice = price * quantity;
      total += totalPrice;
      const itemElement = document.createElement("div");
      itemElement.className = "cart-page__item";
      itemElement.dataset.product = productName;
      itemElement.innerHTML = `
                <img class="cart-page__item-image" src="${productInfo.image || "images/logo/logo-mobile.svg"}" alt="${productName}" loading="lazy">
                <div class="cart-page__item-info">
                    <a href="#" class="cart-page__item-title">${productName}</a>
                    <div class="cart-page__item-details">
                        <span>\u{1F4B0} ${price} \u20BD / \u0448\u0442.</span>
                    </div>
                </div>
                <div class="cart-page__item-counter">
                    <button class="counter-button counter-button--minus" type="button">\u2212</button>
                    <span class="counter-value">${quantity}</span>
                    <button class="counter-button counter-button--plus" type="button">+</button>
                </div>
                <span class="cart-page__item-price">${totalPrice} \u20BD</span>
                <button class="cart-page__item-remove" type="button" aria-label="\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440">\u2715</button>
            `;
      cartList.appendChild(itemElement);
      const minusBtn = itemElement.querySelector(".counter-button--minus");
      const plusBtn = itemElement.querySelector(".counter-button--plus");
      const counterValue = itemElement.querySelector(".counter-value");
      const removeBtn = itemElement.querySelector(".cart-page__item-remove");
      function updateQuantity(newQuantity) {
        if (newQuantity <= 0) {
          delete cart[productName];
          itemElement.style.transform = "scale(0.8)";
          itemElement.style.opacity = "0";
          setTimeout(() => {
            renderCart();
          }, 300);
        } else {
          cart[productName] = newQuantity;
          counterValue.textContent = newQuantity;
          const priceElement = itemElement.querySelector(".cart-page__item-price");
          priceElement.textContent = `${newQuantity * price} \u20BD`;
          updateTotal();
          localStorage.setItem("catEnergyCart", JSON.stringify(cart));
          updateCartBadge();
        }
      }
      plusBtn.addEventListener("click", () => {
        const current = parseInt(counterValue.textContent, 10) || 0;
        updateQuantity(current + 1);
      });
      minusBtn.addEventListener("click", () => {
        const current = parseInt(counterValue.textContent, 10) || 0;
        updateQuantity(current - 1);
      });
      removeBtn.addEventListener("click", () => {
        updateQuantity(0);
      });
    });
    updateTotal();
    updateCartBadge();
  }
  function updateTotal() {
    const items = Object.keys(cart).filter((key) => cart[key] > 0);
    let total = 0;
    items.forEach((productName) => {
      const quantity = cart[productName];
      const productInfo = productsData[productName] || { price: 0 };
      total += productInfo.price * quantity;
    });
    totalPriceElement.textContent = `${total} \u20BD`;
  }
  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (Object.keys(cart).length === 0) {
        alert("\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430!");
        return;
      }
      alert("\u{1F389} \u0417\u0430\u043A\u0430\u0437 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D! \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0443!");
      Object.keys(cart).forEach((key) => delete cart[key]);
      localStorage.setItem("catEnergyCart", JSON.stringify(cart));
      renderCart();
      updateCartBadge();
    });
  }
  renderCart();
});
//# sourceMappingURL=cart-page.js.map
