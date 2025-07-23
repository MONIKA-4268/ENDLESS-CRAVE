import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// Create a new order
router.post('/submit-order', async (req, res) => {
  console.log('📬 New order received:', req.body);

  try {
    const { name, email, items, total, paymentMethod } = req.body;

    // Basic validation
    if (!name || !email || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const newOrder = new Order({ name, email, items, total, paymentMethod });
    await newOrder.save();

    console.log('✅ Order saved:', newOrder);
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

export default router;