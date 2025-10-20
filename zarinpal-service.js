const axios = require('axios');

const ZARINPAL_CONFIG = {
  merchantId: 'YOUR-MERCHANT-ID',
  sandbox: true,
  apiUrl: 'https://sandbox.zarinpal.com/pg/v4/payment'
};

class ZarinpalService {
  constructor() {
    this.merchantId = ZARINPAL_CONFIG.merchantId;
    this.baseUrl = ZARINPAL_CONFIG.sandbox 
      ? 'https://sandbox.zarinpal.com/pg/v4/payment'
      : 'https://api.zarinpal.com/pg/v4/payment';
  }

  async requestPayment(amount, description, callbackUrl, mobile = null, email = null) {
    try {
      const response = await axios.post(`${this.baseUrl}/request.json`, {
        merchant_id: this.merchantId,
        amount: amount,
        description: description,
        callback_url: callbackUrl,
        metadata: {
          mobile: mobile,
          email: email
        }
      });

      if (response.data.data && response.data.data.authority) {
        const authority = response.data.data.authority;
        const paymentUrl = ZARINPAL_CONFIG.sandbox
          ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
          : `https://www.zarinpal.com/pg/StartPay/${authority}`;

        return {
          success: true,
          authority: authority,
          paymentUrl: paymentUrl
        };
      }

      return {
        success: false,
        error: response.data.errors || 'Unknown error'
      };
    } catch (error) {
      console.error('Zarinpal request error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyPayment(authority, amount) {
    try {
      const response = await axios.post(`${this.baseUrl}/verify.json`, {
        merchant_id: this.merchantId,
        authority: authority,
        amount: amount
      });

      if (response.data.data && response.data.data.code === 100) {
        return {
          success: true,
          refId: response.data.data.ref_id,
          cardPan: response.data.data.card_pan
        };
      }

      return {
        success: false,
        error: response.data.errors || 'Verification failed'
      };
    } catch (error) {
      console.error('Zarinpal verify error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ZarinpalService();
