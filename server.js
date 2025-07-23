import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
import morgan from 'morgan';

// Load environment variables first
dotenv.config();
const app = express();

// 📦 Logging incoming requests
app.use(morgan('dev'));

// ✅ Enable CORS for frontend access
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://endless-crave.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// 🧠 Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🗂 Static files setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// 📦 Routes
app.use('/api/orders', orderRoutes);
app.use(express.json()); // ⬅️ Required for POST JSON

// 🩺 Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🚨 Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || '❌ Server error. Please try again later.'
  });
});

// 🌱 Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});