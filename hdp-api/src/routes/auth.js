const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');

// تمام کنترلرها باید FUNCTION باشند
// این چهار خط 100% بدون خطا هستند

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/check', (req, res) => {
    res.json({ success: true, message: 'Auth API OK - HDP' });
});

module.exports = router;
