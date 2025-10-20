const express = require('express');
const app = express();

app.use(express.json());

// صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ سرور پرداخت فعال است',
    time: new Date().toLocaleString('fa-IR')
  });
});

// درخواست پرداخت
app.post('/payment/request', (req, res) => {
  const { amount, description } = req.body;
  
  console.log('💰 دریافت درخواست پرداخت');
  
  const result = {
    success: true,
    paymentId: 'pay_' + Date.now(),
    amount: amount,
    description: description,
    message: 'پرداخت ایجاد شد'
  };
  
  res.json(result);
});

// راه‌اندازی
const PORT = 3000;
app.listen(PORT, () => {
  console.log('🚀 سرور پرداخت راه‌اندازی شد');
  console.log('📡 پورت: ' + PORT);
});
