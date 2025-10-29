const express = require('express');
const router = express.Router();
const MainController = require('../controllers/main-controller');

// Routeهای اصلی
router.get('/', MainController.getHome);
router.get('/drivers', MainController.getDrivers);

module.exports = router;
