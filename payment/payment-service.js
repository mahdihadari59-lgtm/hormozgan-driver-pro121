const db = require('./payment-config');
const zarinpalService = require('./zarinpal-service');

class PaymentService {

  async createRidePayment({ rideId, userId, amount, description }) {
    return new Promise((resolve, reject) => {
      try {
        console.log(`💰 Creating payment for ride ${rideId}, user ${userId}, amount ${amount}`);

        // بررسی وجود سفر
        const ride = db.get('SELECT * FROM rides WHERE id = ?', [rideId]);
        
        if (!ride) {
          console.log('🚗 Creating test ride...');
          // اگر سفر وجود ندارد، یک سفر تستی ایجاد کنید
          const rideResult = db.run(
            'INSERT INTO rides (id, user_id, pickup_address, destination_address) VALUES (?, ?, ?, ?)',
            [rideId, userId, 'آدرس مبدا تست', 'آدرس مقصد تست']
          );
          
          if (!rideResult) {
            reject(new Error('خطا در ایجاد سفر تستی'));
            return;
          }
        }

        this.processPayment(rideId, userId, amount, description, resolve, reject);
      } catch (error) {
        console.error('❌ Create payment error:', error);
        reject(error);
      }
    });
  }

  async processPayment(rideId, userId, amount, description, resolve, reject) {
    try {
      // ایجاد درخواست پرداخت در Zarinpal
      const callbackUrl = `${process.env.APP_URL || 'http://localhost:3001'}/api/payment/verify`;
      
      console.log('🔗 Calling Zarinpal API...');
      const paymentResult = await zarinpalService.createPayment({
        amount,
        description: description || `پرداخت سفر ${rideId}`,
        callbackUrl,
        metadata: {
          ride_id: rideId,
          user_id: userId
        }
      });

      if (!paymentResult.success) {
        console.error('❌ Zarinpal payment failed:', paymentResult.error);
        reject(new Error(paymentResult.error));
        return;
      }

      console.log('✅ Payment request created, authority:', paymentResult.authority);

      // ذخیره تراکنش در دیتابیس
      const transactionResult = db.run(
        `INSERT INTO transactions (
          ride_id, user_id, amount, authority, 
          status, gateway, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [rideId, userId, amount, paymentResult.authority, 'pending', 'zarinpal']
      );

      if (!transactionResult) {
        reject(new Error('خطا در ذخیره تراکنش'));
        return;
      }

      console.log('💾 Transaction saved with ID:', transactionResult.lastInsertRowid);

      resolve({
        success: true,
        transactionId: transactionResult.lastInsertRowid,
        authority: paymentResult.authority,
        paymentUrl: paymentResult.paymentUrl,
        message: 'درخواست پرداخت با موفقیت ایجاد شد'
      });

    } catch (error) {
      console.error('❌ Process payment error:', error);
      reject(error);
    }
  }

  async verifyPayment({ authority, status }) {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔍 Verifying payment with authority:', authority);

        // دریافت اطلاعات تراکنش از دیتابیس
        const transaction = db.get('SELECT * FROM transactions WHERE authority = ?', [authority]);

        if (!transaction) {
          console.error('❌ Transaction not found for authority:', authority);
          reject(new Error('تراکنش یافت نشد'));
          return;
        }

        console.log('📋 Found transaction:', transaction);

        // اگر قبلاً تأیید شده
        if (transaction.status === 'success') {
          console.log('ℹ️ Transaction already verified');
          resolve({
            success: true,
            message: 'این تراکنش قبلاً تأیید شده است',
            refId: transaction.ref_id
          });
          return;
        }

        // اگر پرداخت لغو شده
        if (status === 'NOK') {
          console.log('❌ Payment cancelled by user');
          db.run(
            'UPDATE transactions SET status = ?, updated_at = datetime("now") WHERE id = ?',
            ['failed', transaction.id]
          );
          
          resolve({
            success: false,
            message: 'پرداخت توسط کاربر لغو شد'
          });
          return;
        }

        // تأیید پرداخت با Zarinpal
        this.verifyWithZarinpal(transaction, resolve, reject);

      } catch (error) {
        console.error('❌ Verify payment error:', error);
        reject(error);
      }
    });
  }

  async verifyWithZarinpal(transaction, resolve, reject) {
    try {
      console.log('🔗 Verifying with Zarinpal...');
      const verifyResult = await zarinpalService.verifyPayment({
        authority: transaction.authority,
        amount: transaction.amount
      });

      if (verifyResult.success) {
        console.log('✅ Payment verified successfully');
        
        // به‌روزرسانی تراکنش
        db.run(
          `UPDATE transactions 
           SET status = ?, ref_id = ?, card_pan = ?, 
               verified_at = datetime('now'), updated_at = datetime('now')
           WHERE id = ?`,
          ['success', verifyResult.refId, verifyResult.cardPan, transaction.id]
        );

        // به‌روزرسانی وضعیت سفر
        db.run(
          'UPDATE rides SET payment_status = ?, updated_at = datetime("now") WHERE id = ?',
          ['paid', transaction.ride_id]
        );

        console.log('🎉 Payment completed successfully');
        resolve({
          success: true,
          refId: verifyResult.refId,
          message: 'پرداخت با موفقیت انجام شد'
        });
      } else {
        console.error('❌ Payment verification failed:', verifyResult.error);
        
        // به‌روزرسانی به وضعیت خطا
        db.run(
          'UPDATE transactions SET status = ?, error_message = ?, updated_at = datetime("now") WHERE id = ?',
          ['failed', verifyResult.error, transaction.id]
        );
        
        resolve({
          success: false,
          message: verifyResult.error
        });
      }
    } catch (verifyError) {
      console.error('❌ Verification error:', verifyError);
      reject(verifyError);
    }
  }

  async getUserTransactions(userId, limit = 50) {
    try {
      const transactions = db.all(
        `SELECT 
          t.*,
          r.pickup_address,
          r.destination_address
        FROM transactions t
        LEFT JOIN rides r ON t.ride_id = r.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT ?`,
        [userId, limit]
      );

      console.log(`📊 Found ${transactions.length} transactions for user ${userId}`);
      return transactions;
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      throw error;
    }
  }

  // متد کمکی برای دریافت تراکنش بر اساس ID
  getTransactionById(transactionId) {
    return db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
  }

  // متد کمکی برای دریافت تمام تراکنش‌های pending
  getPendingTransactions() {
    return db.all('SELECT * FROM transactions WHERE status = "pending"');
  }
}

module.exports = new PaymentService();
