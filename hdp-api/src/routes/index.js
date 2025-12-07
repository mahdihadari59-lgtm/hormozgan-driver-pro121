const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/driver', require('./driver'));
router.use('/trip', require('./trip'));
router.use('/payment', require('./payment'));

router.get('/health', (req, res) => {
    res.json({ success: true, api: "HDP API OK" });
});

module.exports = router;
