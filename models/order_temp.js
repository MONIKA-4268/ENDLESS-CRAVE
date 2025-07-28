import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'upi', 'card'] // adjust as needed
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
}, {
  timestamps: true
});

const Order = mongoose.model('order', orderSchema);

export default Order;
