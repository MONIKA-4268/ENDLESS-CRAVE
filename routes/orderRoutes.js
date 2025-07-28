// routes/orderRoutes.js
import express from 'express';
import Order from '../models/order.js'; // ✅ Correct path with .js extension if using ES modules

const router = express.Router();

router.post('/submit-order', async (req, res) => {
  try {
    const { customerName, amount, paymentMethod, items } = req.body;

    if (!customerName || !amount || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const neworder = new order({
      customerName,
      amount,
      paymentMethod,
      items,
    });

    await neworder.save();
    res.status(201).json({ message: 'order stored successfully' });
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
