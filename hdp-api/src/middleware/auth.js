const jwt = require('jsonwebtoken');
const { User, Driver } = require('../models');

module.exports = async function(req, res, next) {
  try {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'توکن احراز هویت ارائه نشده است'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hdp-secret-key-2025');
    
    // Get user from database
    const user = await User.findByPk(decoded.id || decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Add user to request
    req.user = user;

    // Get driver info if user is driver
    if (user.role === 'driver') {
      const driver = await Driver.findOne({ where: { userId: user.id } });
      if (driver) {
        req.user.driverId = driver.id;
      }
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است'
    });
  }
};
