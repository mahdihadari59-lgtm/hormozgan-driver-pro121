const axios = require('axios');

class ZarinpalService {
  constructor() {
    this.merchantId = process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    this.apiUrl = 'https://api.zarinpal.com/pg/v4/payment';
    this.sandboxUrl = 'https://sandbox.zarinpal.com/pg/v4/payment';
    this.useSandbox = process.env.NODE_ENV !== 'production';
    this.baseUrl = this.useSandbox ? this.sandboxUrl : this.apiUrl;
  }

  async createPayment({ amount, description, mobile, email, callbackUrl, metadata = {} }) {
    try {
      console.log('🔗 Creating payment request to Zarinpal...');
      
      const response = await axios.post(`${this.baseUrl}/request.json`, {
        merchant_id: this.merchantId,
        amount: amount * 10, // تومان به ریال
        description,
        callback_url: callbackUrl,
        metadata: {
          mobile,
          email,
          ...metadata
        }
      });

      const data = response.data;
      console.log('📦 Zarinpal response:', data);

      if (data.data && data.data.code === 100) {
        return {
          success: true,
          authority: data.data.authority,
          paymentUrl: `https://${this.useSandbox ? 'sandbox' : 'www'}.zarinpal.com/pg/StartPay/${data.data.authority}`,
          message: 'درخواست پرداخت با موفقیت ایجاد شد'
        };
      }

      return {
        success: false,
        error: data.errors || 'خطا در ایجاد درخواست پرداخت',
        code: data.data?.code
      };

    } catch (error) {
      console.error('❌ Zarinpal create payment error:', error.message);
      return {
        success: false,
        error: 'خطا در ارتباط با درگاه پرداخت'
      };
    }
  }

  async verifyPayment({ authority, amount }) {
    try {
      console.log('🔍 Verifying payment with authority:', authority);
      
      const response = await axios.post(`${this.baseUrl}/verify.json`, {
        merchant_id: this.merchantId,
        authority,
        amount: amount * 10 // تومان به ریال
      });

      const data = response.data;
      console.log('📦 Verification response:', data);

      if (data.data && data.data.code === 100) {
        return {
          success: true,
          refId: data.data.ref_id,
          cardPan: data.data.card_pan,
          cardHash: data.data.card_hash,
          feeType: data.data.fee_type,
          fee: data.data.fee,
          message: 'پرداخت با موفقیت تأیید شد'
        };
      } else if (data.data && data.data.code === 101) {
        return {
          success: true,
          verified: true,
          refId: data.data.ref_id,
          message: 'این تراکنش قبلاً تأیید شده است'
        };
      }

      return {
        success: false,
        error: this.getErrorMessage(data.data?.code),
        code: data.data?.code
      };

    } catch (error) {
      console.error('❌ Zarinpal verify payment error:', error.message);
      return {
        success: false,
        error: 'خطا در تأیید پرداخت'
      };
    }
  }

  getErrorMessage(code) {
    const errors = {
      '-9': 'خطای اعتبارسنجی',
      '-10': 'ای پی و یا مرچنت کد پذیرنده صحیح نیست',
      '-11': 'مرچنت کد فعال نیست',
      '-12': 'تلاش بیش از دفعات مجاز در یک بازه زمانی کوتاه',
      '-15': 'ترمینال شما به حالت تعلیق در آمده',
      '-16': 'سطح تایید پذیرنده پایین تر از سطح نقره ای است',
      '-30': 'اجازه دسترسی به تسویه اشتر
