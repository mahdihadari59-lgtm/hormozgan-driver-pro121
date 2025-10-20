const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes اصلی پروژه
app.get('/', (req, res) => {
  res.json({
    message: '🚀 هرمزگان درایور پرو - سامانه کامل تاکسی آنلاین',
    version: '2.0.0',
    services: {
      main: 'سرور اصلی',
      payment: 'سیستم پرداخت زرین‌پال'
    },
    endpoints: {
      home: 'GET /',
      health: 'GET /api/health',
      rideRequest: 'POST /api/ride/request',
      paymentCreate: 'POST /api/payment/create',
      paymentVerify: 'GET /api/payment/verify',
      userTransactions: 'GET /api/payment/transactions/:userId'
    }
  });
});

// ایمپورت سرویس پرداخت
const paymentService = require('./payment/payment-service');

// مسیر سلامت سرویس
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ سرور اصلی فعال',
    timestamp: new Date().toISOString(),
    services: ['main', 'payment'],
    environment: process.env.NODE_ENV || 'development'
  });
});

// مسیر درخواست سفر
app.post('/api/ride/request', (req, res) => {
  try {
    const { userId, pickup, destination } = req.body;
    
    if (!userId || !pickup || !destination) {
      return res.status(400).json({
        success: false,
        error: 'پارامترهای userId, pickup, destination الزامی هستند'
      });
    }

    // شبیه‌سازی ایجاد سفر
    const rideId = Math.floor(Math.random() * 1000) + 1;
    
    res.json({
      success: true,
      rideId: rideId,
      message: 'درخواست سفر با موفقیت ثبت شد',
      data: {
        userId,
        pickup,
        destination,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Ride request error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت درخواست سفر'
    });
  }
});

// ========== مسیرهای پرداخت ==========

// ایجاد درخواست پرداخت
app.post('/api/payment/create', async (req, res) => {
  try {
    const { rideId, userId, amount, description } = req.body;
    
    if (!rideId || !userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'پارامترهای rideId, userId و amount الزامی هستند'
      });
    }

    const result = await paymentService.createRidePayment({
      rideId,
      userId,
      amount,
      description
    });

    res.json(result);
  } catch (error) {
    console.error('❌ Create payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// تأیید پرداخت
app.get('/api/payment/verify', async (req, res) => {
  try {
    const { Authority, Status } = req.query;
    
    if (!Authority) {
      return res.status(400).send(`
        <html dir="rtl">
          <head><meta charset="UTF-8"><title>خطا</title></head>
          <body style="font-family: Tahoma; text-align: center; padding: 50px;">
            <h1 style="color: red;">❌ خطا در پارامترها</h1>
            <p>پارامتر Authority ارسال نشده است</p>
            <button onclick="window.close()" style="padding: 10px 20px; margin: 10px;">بستن</button>
          </body>
        </html>
      `);
    }

    const result = await paymentService.verifyPayment({
      authority: Authority,
      status: Status
    });

    if (result.success) {
      res.send(`
        <html dir="rtl">
          <head><meta charset="UTF-8"><title>پرداخت موفق</title></head>
          <body style="font-family: Tahoma; text-align: center; padding: 50px; background: #f0f8f0;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #28a745;">✅ پرداخت موفق</h1>
              <p style="font-size: 16px; margin: 20px 0;">${result.message}</p>
              <p style="font-size: 14px; color: #666;">کد رهگیری: <strong style="color: #333;">${result.refId}</strong></p>
              <button onclick="window.close()" style="padding: 10px 20px; margin: 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">بستن</button>
            </div>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html dir="rtl">
          <head><meta charset="UTF-8"><title>پرداخت ناموفق</title></head>
          <body style="font-family: Tahoma; text-align: center; padding: 50px; background: #fff8f8;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #dc3545;">❌ پرداخت ناموفق</h1>
              <p style="font-size: 16px; margin: 20px 0;">${result.message}</p>
              <button onclick="window.close()" style="padding: 10px 20px; margin: 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">بستن</button>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(500).send(`
      <html dir="rtl">
        <body style="font-family: Tahoma; text-align: center; padding: 50px;">
          <h1 style="color: red;">❌ خطا در تأیید پرداخت</h1>
          <p>${error.message}</p>
          <button onclick="window.close()" style="padding: 10px 20px; margin: 10px;">بستن</button>
        </body>
      </html>
    `);
  }
});

// تاریخچه تراکنش‌های کاربر
app.get('/api/payment/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await paymentService.getUserTransactions(userId);
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// اطلاعات تراکنش
app.get('/api/payment/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = paymentService.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'تراکنش یافت نشد'
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('❌ Get transaction error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 سرور کامل هرمزگان درایور اجرا شد روی پورت ${PORT}`);
  console.log(`📍 آدرس اصلی: http://localhost:${PORT}`);
  console.log(`💳 سیستم پرداخت: http://localhost:${PORT}/api/payment`);
  console.log(`🏥 سلامت سرویس: http://localhost:${PORT}/api/health`);
  console.log(`🌐 محیط: ${process.env.NODE_ENV || 'development'}`);
});
