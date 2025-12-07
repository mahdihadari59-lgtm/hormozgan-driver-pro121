/**
 * مسیرهای پرداخت
 */

const express = require('express');
const router = express.Router();
const paymentService = require('./payment-service');

/**
 * POST /payment/initiate
 */
router.post('/initiate', async (req, res) => {
  try {
    const { orderId, amount, userId, gateway } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ success: false, message: 'پارامترهای ناقص' });
    }

    const result = await paymentService.initiatePayment(orderId, amount, userId, gateway);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /payment/verify
 */
router.get('/verify', async (req, res) => {
  try {
    const { Authority, Status, authority } = req.query;
    const auth = Authority || authority;

    if (!auth) {
      return res.status(400).json({ success: false });
    }

    if (Status === 'OK') {
      res.json({ success: true, message: 'پرداخت موفق' });
    } else {
      res.json({ success: false, message: 'پرداخت ناموفق' });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

/**
 * GET /payment/status/:id
 */
router.get('/status/:id', async (req, res) => {
  try {
    const status = await paymentService.getStatus(req.params.id, 'zarinpal');
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
