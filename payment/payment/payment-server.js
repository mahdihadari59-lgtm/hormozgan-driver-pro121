const express = require('express');
const PaymentService = require('./payment-service');

const app = express();
const paymentService = new PaymentService();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <html dir="rtl">
    <head><title>سیستم پرداخت</title></head>
    <body>
      <h1>💳 سیستم پرداخت Hormozgan Driver Pro</h1>
      <p>سرور پرداخت فعال است</p>
    </body>
    </html>
  `);
});

app.post('/payment/request', async (req, res) => {
  const { amount, description, mobile, email } = req.body;
  
  console.log(`📱 درخواست پرداخت: ${amount} تومان`);
  
  if (!amount || !description) {
    return res.json({
      success: false,
      message: 'مبلغ و توضیحات الزامی است'
    });
  }
  
  const result = await paymentService.requestZarinPalPayment(
    amount, 
    description, 
    mobile || '09123456789', 
    email || 'test@example.com'
  );
  
  res.json(result);
});

app.post('/payment/verify', async (req, res) => {
  const { authority, amount } = req.body;
  
  console.log(`🔍 تأیید پرداخت: ${authority}`);
  
  if (!authority || !amount) {
    return res.json({
      success: false,
      message: 'کد پیگیری و مبلغ الزامی است'
    });
  }
  
  const result = await paymentService.verifyZarinPalPayment(authority, amount);
  
  if (result.success) {
    console.log(`🎉 پرداخت موفق: ${result.refId}`);
    
    const paymentData = {
      authority: authority,
      amount: amount,
      refId: result.refId,
      gateway: 'zarinpal',
      status: 'completed',
      timestamp: new Date().toISOString()
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      `payment_${authority}.json`,
      JSON.stringify(paymentData, null, 2)
    );
  }
  
  res.json(result);
});

app.get('/payment/status/:authority', (req, res) => {
  const { authority } = req.params;
  
  try {
    const fs = require('fs');
    const paymentFile = `payment_${authority}.json`;
    
    if (fs.existsSync(paymentFile)) {
      const paymentData = JSON.parse(fs.readFileSync(paymentFile, 'utf8'));
      res.json({
        success: true,
        data: paymentData
      });
    } else {
      res.json({
        success: false,
        message: 'پرداخت یافت نشد'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'خطا در خواندن اطلاعات'
    });
  }
});

const PORT = 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`💳 سرور پرداخت روی پورت ${PORT}`);
  console.log(`🌐 آدرس: http://localhost:${PORT}`);
});
