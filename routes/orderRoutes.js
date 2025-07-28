import express from 'express';
import Order from '../models/order.js'; // ✅ Add ".js" extension for ES module resolution

const router = express.Router();

router.post('/submit-order', async (req, res) => {
  try {
    const { orderData, paymentData } = req.body;

    console.log('🧾 Received orderData:', orderData);
    console.log('💳 Received paymentData:', paymentData);

    // Validate required fields from orderData
    const { customerName, amount, paymentMethod, items } = orderData || {};

    if (
      !customerName ||
      !amount ||
      !paymentMethod ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    // Create new order document
    const newOrder = new Order({
      ...orderData,
      ...paymentData
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved:', savedOrder);

    return res.status(200).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('❌ Order submission error:', err);

    if (err.name === 'ValidationError') {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;