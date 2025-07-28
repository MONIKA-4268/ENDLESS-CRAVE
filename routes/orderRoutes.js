const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // ✅ lowercase import

router.post('/submit-order', async (req, res) => {
  try {
    const { orderData, paymentData } = req.body;

    console.log('🧾 Received orderData:', orderData);
    console.log('💳 Received paymentData:', paymentData);

    const newOrder = new Order({
      ...orderData,
      ...paymentData
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved:', savedOrder);
    res.status(200).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('❌ Mongoose Validation Error:', err);

    if (err.name === 'ValidationError') {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;