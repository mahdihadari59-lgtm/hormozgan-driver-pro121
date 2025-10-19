const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentService = require('./payment-service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/api/payment/create', async (req, res) => {
  try {
    const { rideId, userId, amount, description } = req.body;
    
    const result = await paymentService.createRidePayment({
      rideId,
      userId,
      amount,
      description
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/payment/verify', async (req, res) => {
  try {
    const { Authority, Status } = req.query;
    
    const result = await paymentService.verifyPayment({
      authority: Authority,
      status: Status
    });

    if (result.success) {
      res.send(`
        <html>
          <body>
            <h1>پرداخت موفق</h1>
            <p>${result.message}</p>
            <p>کد رهگیری: ${result.refId}</p>
            <button onclick="window.close()">بستن</button>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <body>
            <h1>پرداخت ناموفق</h1>
            <p>${result.message}</p>
            <button onclick="window.close()">بستن</button>
          </body>
        </html>
      `);
    }
  } catch (error) {
    res.status(500).send('خطا در تأیید پرداخت');
  }
});

app.get('/api/payment/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await paymentService.getUserTransactions(userId);
    
    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
