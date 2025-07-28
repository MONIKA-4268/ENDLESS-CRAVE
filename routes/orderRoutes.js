import express from 'express';
import Order from '../models/order.js'; // Correct path and case
const router = express.Router();

router.post('/submit-order', async (req, res) => {
  try {
    const { customerName, amount, paymentMethod, items } = req.body;
    if (!customerName || !amount || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const newOrder = new Order({ customerName, amount, paymentMethod, items });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
