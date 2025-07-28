import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
import Order from './models/order.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// 🌐 Conditionally apply morgan logging only in non-production
if (process.env.NODE_ENV !== 'production') {
  try {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
  } catch (err) {
    console.warn('⚠️ Morgan not found or failed to load:', err.message);
  }
}

// 🤝 Enable CORS for both local and deployed frontends
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://endless-crave.onrender.com',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// 📦 Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🗂️ Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// 🔗 Mount API routes
app.use('/api/orders', orderRoutes);

// 🩺 Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🛑 Fallback route for unknown paths
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// ❗ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 🚀 Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });