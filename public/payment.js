document.addEventListener('DOMContentLoaded', () => {
  const methodSelect = document.getElementById('method');

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

  // Submit form
  document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const method = methodSelect.value;
    const card = document.getElementById('card')?.value?.trim() || '';
    const amountRaw = localStorage.getItem('total');
    const cartRaw = localStorage.getItem('cart');
    const amount = Number(amountRaw);

    // Validate
    if (!name || !method || isNaN(amount) || amount <= 0 || !cartRaw) {
      alert("❗ Please fill all required fields with valid data.");
      return;
    }

    const items = JSON.parse(cartRaw);

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

    // Debug logs
    console.log("🧾 Sending orderData:", JSON.stringify(orderData, null, 2));
console.log("💳 Sending paymentData:", JSON.stringify(paymentData, null, 2));


    try {
      // Order submission
      const orderRes = await fetch('https://endless-crave.onrender.com/api/orders/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderRes.json();
      console.log("📦 Order response:", JSON.stringify(orderResult, null, 2));


      if (!orderRes.ok) {
        alert(`❌ Failed to place order: ${orderResult.error || "Unknown error"}`);
        return;
      }

      // Payment submission
      const paymentRes = await fetch('https://endless-crave.onrender.com/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const paymentResult = await paymentRes.json();
      console.log("💳 Payment response:", paymentResult);

      if (!paymentRes.ok) {
        alert(`❌ Payment failed: ${paymentResult.error || "Unknown error"}`);
        return;
      }

      alert(paymentResult.message || `✅ Order placed successfully via ${method.toUpperCase()}!`);
      localStorage.clear();
      window.location.href = 'index.html';

    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("❌ Server error. Please try again later.");
    console.log("🧾 Sending orderData:", JSON.stringify(orderData, null, 2));
    console.log("💳 Sending paymentData:", JSON.stringify(paymentData, null, 2));
    }
  });
});
