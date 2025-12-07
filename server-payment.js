/**
 * سرور اصلی با پشتیبانی پرداخت
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const paymentRoutes = require('./payment/payment-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسیرهای پرداخت
app.use('/api/payment', paymentRoutes);

// مسیر اصلی
app.get('/', (req, res) => {
  res.json({
    message: 'Hormozgan Driver Pro - Payment Server',
    version: process.env.VERSION || '6.1.0',
    status: 'active'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ خطا:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// شروع سرور
app.listen(PORT, process.env.HOST || '0.0.0.0', () => {
  console.log(`🚀 سرور پرداخت در حال اجرا: http://localhost:${PORT}`);
});
