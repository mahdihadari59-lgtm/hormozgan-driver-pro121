const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const PaymentController = require("../controllers/paymentController");

router.get("/history", auth, PaymentController.paymentHistory);
router.post("/verify", auth, PaymentController.verifyPayment);

module.exports = router;
