document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  let cart = {};

  window.addToCart = function(name, price) {
    if (cart[name]) {
      cart[name].qty++;
    } else {
      cart[name] = { price, qty: 1 };
    }
    renderCart();
  };

  window.removeFromCart = function(name) {
    if (cart[name]) {
      cart[name].qty--;
      if (cart[name].qty <= 0) {
        delete cart[name];
      }
      renderCart();
    }
  };

  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;

    Object.keys(cart).forEach(item => {
      const { price, qty } = cart[item];
      cartItems.innerHTML += `
        <p>${item} x ${qty} – ₹${price * qty}
          <button onclick="removeFromCart('${item}')" style="margin-left:10px;background:red;color:white;border:none;padding:2px 6px;border-radius:4px;">X</button>
        </p>`;
      total += price * qty;
    });

    cartTotal.textContent = `Total: ₹${total}`;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
  }
});