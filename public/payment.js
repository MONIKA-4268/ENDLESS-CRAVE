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

  // 🧩 Toggle payment method sections
  if (methodSelect) {
    methodSelect.addEventListener('change', () => {
      const method = methodSelect.value;
      for (const key in sections) {
        if (sections[key]) {
          sections[key].classList.add('hide');
        }
      }
      if (sections[method]) {
        sections[method].classList.remove('hide');
      }
    });
  } else {
    console.error("❌ Element with ID 'method' not found.");
  }

  // 🧾 Handle payment form submission
  if (!paymentForm) {
    console.error("❌ Form with ID 'paymentForm' not found.");
    return;
  }

  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const method = methodSelect?.value.trim() || "";
    const card = document.getElementById("card-number")?.value.trim() || "";
    const cartRaw = localStorage.getItem("cart");

    if (!name || !method) {
      alert("❗ Please fill out all required fields.");
      return;
    }

    if (!cartRaw) {
      alert("🛒 Your cart is empty!");
      return;
    }

    const rawItems = JSON.parse(cartRaw);
    const items = Object.keys(rawItems).map((itemName) => ({
      name: itemName,
      price: Number(rawItems[itemName].price),
      quantity: Number(rawItems[itemName].qty),
    }));

    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderData = {
      customerName: name,
      amount,
      paymentMethod: method,
      items,
    };

    const paymentData = {
      name,
      card,
      amount,
    };

    console.log("🧾 Sending orderData:", orderData);
    console.log("💳 Sending paymentData:", paymentData);

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
        window.location.href = window.location.origin;
      } else {
        alert("❌ Order failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Something went wrong. Please try again later.");
    }
  });
});