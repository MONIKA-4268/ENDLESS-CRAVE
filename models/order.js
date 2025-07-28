const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true }
  }],
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod', 'netbanking'],
    required: true
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// ✅ lowercase 'order'
module.exports = mongoose.model('order', orderSchema);