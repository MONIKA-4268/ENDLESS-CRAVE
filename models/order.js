// models/order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: String,
  amount: Number,
  paymentMethod: String,
  items: Array,
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order; // ✅ This is crucial
