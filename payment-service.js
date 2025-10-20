const db = require('./payment-config');
const zarinpalService = require('./zarinpal-service');

async function createPaymentRequest(rideId, userId, amount, description, callbackUrl) {
  try {
    console.log('Creating payment request for ride:', rideId);
    
    const zarinpalResult = await zarinpalService.requestPayment(
      amount,
      description,
      callbackUrl
    );

    if (!zarinpalResult.success) {
      throw new Error('Zarinpal request failed: ' + zarinpalResult.error);
    }

    const result = db.run(
      'INSERT INTO transactions (ride_id, user_id, amount, authority, status, gateway) VALUES (?, ?, ?, ?, ?, ?)',
      [rideId, userId, amount, zarinpalResult.authority, 'pending', 'zarinpal']
    );

    console.log('Transaction created with ID:', result.lastInsertRowid);

    return {
      success: true,
      transactionId: result.lastInsertRowid,
      authority: zarinpalResult.authority,
      paymentUrl: zarinpalResult.paymentUrl
    };
  } catch (error) {
    console.error('Payment request error:', error);
    throw error;
  }
}

async function verifyPayment(authority, status) {
  try {
    console.log('Verifying payment for authority:', authority);

    const transaction = db.get(
      'SELECT * FROM transactions WHERE authority = ?',
      [authority]
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (status !== 'OK') {
      db.run(
        'UPDATE transactions SET status = ?, error_message = ? WHERE id = ?',
        ['failed', 'Payment cancelled by user', transaction.id]
      );
      return { success: false, message: 'Payment cancelled' };
    }

    const zarinpalResult = await zarinpalService.verifyPayment(
      authority,
      transaction.amount
    );

    if (zarinpalResult.success) {
      db.run(
        'UPDATE transactions SET status = ?, ref_id = ?, card_pan = ? WHERE id = ?',
        ['success', zarinpalResult.refId, zarinpalResult.cardPan, transaction.id]
      );

      db.run(
        'UPDATE rides SET payment_status = ? WHERE id = ?',
        ['paid', transaction.ride_id]
      );

      console.log('Payment verified successfully');
      return {
        success: true,
        refId: zarinpalResult.refId,
        transaction: transaction
      };
    } else {
      db.run(
        'UPDATE transactions SET status = ?, error_message = ? WHERE id = ?',
        ['failed', zarinpalResult.error, transaction.id]
      );
      return { success: false, message: zarinpalResult.error };
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

function getTransactionsByUser(userId, limit = 10) {
  try {
    return db.all(
      'SELECT t.*, r.pickup_address, r.destination_address FROM transactions t LEFT JOIN rides r ON t.ride_id = r.id WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT ?',
      [userId, limit]
    );
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
}

function getTransactionById(transactionId) {
  try {
    return db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
  } catch (error) {
    console.error('Get transaction error:', error);
    throw error;
  }
}

module.exports = {
  createPaymentRequest,
  verifyPayment,
  getTransactionsByUser,
  getTransactionById
};
