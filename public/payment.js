document.addEventListener('DOMContentLoaded', () => {
  const methodSelect = document.getElementById('method');
  const paymentForm = document.getElementById('paymentForm');

  const sections = {
    upi: document.getElementById('upi-section'),
    card: document.getElementById('card-section'),
    netbanking: document.getElementById('netbanking-section'),
    gpay: document.getElementById('gpay-section'),
    paypal: document.getElementById('paypal-section'),
  };

  // Toggle payment method sections
  methodSelect.addEventListener('change', () => {
    const method = methodSelect.value;
    for (const key in sections) {
      sections[key].classList.add('hide');
    }
    if (sections[method]) {
      sections[method].classList.remove('hide');
    }
  });

  // Handle payment form submit
  if (!paymentForm) {
    console.error("❌ Form with ID 'paymentForm' not found.");
    return;
  }

  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const method = methodSelect.value;
    const card = document.getElementById("card-number")?.value || "";
    const cartRaw = localStorage.getItem("cart");

    if (!cartRaw) {
      alert("Your cart is empty!");
      return;
    }

    const rawItems = JSON.parse(cartRaw);
    const items = Object.keys(rawItems).map((itemName) => ({
      name: itemName,
      price: rawItems[itemName].price,
      quantity: rawItems[itemName].qty
    }));

    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderData = {
      customerName: name,
      amount,
      paymentMethod: method,
      items
    };

    const paymentData = {
      name,
      card,
      amount
    };

console.log("🧾 Sending orderData:", JSON.stringify(orderData, null, 2));
console.log("💳 Sending paymentData:", JSON.stringify(paymentData, null, 2));

    try {
      const response = await fetch("https://endless-crave.onrender.com/api/orders/submit-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("📦 Order response:", result);

      if (response.ok) {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "/";
      } else {
        alert("❌ Order failed: " + result.error);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Something went wrong. Try again later.");
    }
  });
});
