import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { orderRoutes } from './routes/orderRoutes.js';

dotenv.config();
const app = express();

// Morgan logging in development
if (process.env.NODE_ENV !== 'production') {
  try {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
  } catch (err) {
    console.warn('⚠️ Morgan not found or failed to load:', err.message);
  }
}

// CORS setup
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://endless-crave.onrender.com',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.all('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
