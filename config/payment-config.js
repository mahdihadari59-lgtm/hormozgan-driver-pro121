/**
 * تنظیمات درگاه‌های پرداخت
 */

module.exports = {
  zarinpal: {
    merchantId: process.env.ZARINPAL_MERCHANT_ID || 'merchant_id_placeholder',
    requestUrl: 'https://api.zarinpal.com/v4/payment/request.json',
    verifyUrl: 'https://api.zarinpal.com/v4/payment/verify.json',
    paymentUrl: 'https://www.zarinpal.com/pg/StartPay/',
    timeout: 30000,
    description: 'سفارش هرمزگان درایور پرو'
  },
  
  idpay: {
    apiKey: process.env.IDPAY_API_KEY || 'api_key_placeholder',
    requestUrl: 'https://api.idpay.ir/v1.1/payment',
    verifyUrl: 'https://api.idpay.ir/v1.1/payment/verify',
    sandbox: process.env.IDPAY_SANDBOX === 'true',
    timeout: 30000
  },
  
  payir: {
    apiKey: process.env.PAYIR_API_KEY || 'api_key_placeholder',
    requestUrl: 'https://payir.com/api/send',
    verifyUrl: 'https://payir.com/api/verify',
    timeout: 30000
  },

  callbacks: {
    success: process.env.CALLBACK_URL || 'http://localhost:3000',
    failed: process.env.CALLBACK_URL || 'http://localhost:3000'
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key'
  },

  limits: {
    minAmount: 1000,
    maxAmount: 1000000000,
    timeout: 3600
  }
};
