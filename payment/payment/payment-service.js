const axios = require('axios');
const config = require('./payment-config');

class PaymentService {
  async requestZarinPalPayment(amount, description, mobile, email) {
    try {
      console.log(`💰 درخواست پرداخت: ${amount} تومان`);
      
      const data = {
        merchant_id: config.zarinpal.merchantId,
        amount: amount * 10,
        description: description,
        callback_url: config.zarinpal.callbackUrl
      };

      const response = await axios.post(
        'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.Status === 100) {
        const paymentUrl = `https://sandbox.zarinpal.com/pg/StartPay/${response.data.Authority}`;
        
        return {
          success: true,
          authority: response.data.Authority,
          paymentUrl: paymentUrl,
          message: 'درخواست پرداخت موفق'
        };
      } else {
        return {
          success: false,
          message: `خطا: ${response.data.Status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطای شبکه: ${error.message}`
      };
    }
  }

  async verifyZarinPalPayment(authority, amount) {
    try {
      console.log(`🔍 تأیید پرداخت: ${authority}`);
      
      const data = {
        merchant_id: config.zarinpal.merchantId,
        authority: authority,
        amount: amount * 10
      };

      const response = await axios.post(
        'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.Status === 100) {
        return {
          success: true,
          refId: response.data.RefID,
          message: 'پرداخت موفق'
        };
      } else {
        return {
          success: false,
          message: `پرداخت ناموفق: ${response.data.Status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطای شبکه: ${error.message}`
      };
    }
  }
}

module.exports = PaymentService;
