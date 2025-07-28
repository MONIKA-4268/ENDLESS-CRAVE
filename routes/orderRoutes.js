// routes/orderRoutes.js
import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

router.post('/submit-order', async (req, res) => {
  try {
    const { customerName, amount, paymentMethod, items } = req.body;

    if (!customerName || !amount || !paymentMethod || !items) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const newOrder = new Order({
      customerName,
      amount,
      paymentMethod,
      items,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
