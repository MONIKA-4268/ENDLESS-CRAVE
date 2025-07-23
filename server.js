import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';

// Load environment variables first
dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://endless-crave.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ...then your other middleware and routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/orders', orderRoutes);
app.options('*', cors()); // Handle preflight requests

// Health check route (optional, for debugging)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler (should be before app.listen)
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: '❌ Server error. Please try again later.' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});