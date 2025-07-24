// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: String,
  amount: Number,
  paymentMethod: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
