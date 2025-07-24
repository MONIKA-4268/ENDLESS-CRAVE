import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// Create a new order
router.post('/submit-order', async (req, res) => {
  try {
    const { customerName, amount, paymentMethod, items } = req.body;

   console.log("🧾 Sending orderData:", JSON.stringify(orderData, null, 2));
console.log("💳 Sending paymentData:", JSON.stringify(paymentData, null, 2));


    const newOrder = new Order({ customerName, amount, paymentMethod, items });
    await newOrder.save();

    res.status(201).json({ message: 'Order saved', orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Order saving error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
