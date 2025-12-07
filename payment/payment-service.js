/**
 * سرویس پرداخت - Hormozgan Driver Pro
 */

const axios = require('axios');
const config = require('../config/payment-config');

class PaymentService {
  /**
   * درخواست پرداخت
   */
  async initiatePayment(orderId, amount, userId, gateway = 'zarinpal') {
    try {
      console.log(`💳 شروع پرداخت - Order: ${orderId}, Amount: ${amount}, Gateway: ${gateway}`);
      
      let result;

      switch (gateway) {
        case 'zarinpal':
          result = await this.zarinpalRequest(orderId, amount);
          break;
        case 'idpay':
          result = await this.idpayRequest(orderId, amount);
          break;
        case 'payir':
          result = await this.payirRequest(orderId, amount);
          break;
        default:
          throw new Error('درگاه نامعتبر');
      }

      return result;
    } catch (error) {
      console.error(`❌ خطا: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * درخواست Zarinpal
   */
  async zarinpalRequest(orderId, amount) {
    try {
      const cfg = config.zarinpal;
      const response = await axios.post(cfg.requestUrl, {
        merchant_id: cfg.merchantId,
        amount: amount * 10,
        description: cfg.description,
        callback_url: `${config.callbacks.success}/payment/verify`
      }, { timeout: cfg.timeout });

      if (response.data.data.code === 100) {
        return {
          success: true,
          gateway: 'zarinpal',
          authority: response.data.data.authority,
          paymentUrl: `${cfg.paymentUrl}${response.data.data.authority}`
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * تایید Zarinpal
   */
  async zarinpalVerify(authority, amount) {
    try {
      const cfg = config.zarinpal;
      const response = await axios.post(cfg.verifyUrl, {
        merchant_id: cfg.merchantId,
        amount: amount * 10,
        authority: authority
      }, { timeout: cfg.timeout });

      if (response.data.data.code === 100) {
        return { success: true, refId: response.data.data.ref_id };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * درخواست IDPay
   */
  async idpayRequest(orderId, amount) {
    try {
      const cfg = config.idpay;
      const response = await axios.post(cfg.requestUrl, {
        order_id: orderId,
        amount: amount,
        callback: `${config.callbacks.success}/payment/verify`
      }, {
        headers: { 'X-API-KEY': cfg.apiKey },
        timeout: cfg.timeout
      });

      if (response.data.link) {
        return {
          success: true,
          gateway: 'idpay',
          transactionId: response.data.id,
          paymentUrl: response.data.link
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * درخواست Payir
   */
  async payirRequest(orderId, amount) {
    try {
      const cfg = config.payir;
      const response = await axios.post(cfg.requestUrl, {
        api: cfg.apiKey,
        amount: amount * 1000,
        redirect: `${config.callbacks.success}/payment/verify`,
        orderId: orderId
      }, { timeout: cfg.timeout });

      if (response.data.status === 1) {
        return {
          success: true,
          gateway: 'payir',
          token: response.data.token,
          paymentUrl: `https://payir.com/pay/refer/${response.data.token}`
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * دریافت وضعیت
   */
  async getStatus(transactionId, gateway) {
    console.log(`📊 بررسی وضعیت: ${transactionId}`);
    return {
      transactionId,
      gateway,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new PaymentService();
