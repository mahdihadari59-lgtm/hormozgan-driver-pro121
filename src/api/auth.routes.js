const express = require('express');
const router = express.Router();
const authService = require('../auth/auth.service');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, role } = req.body;

    if (!phone || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const result = await authService.register({ phone, password, name, role });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Phone and password are required'
      });
    }

    const result = await authService.login({ phone, password });
    res.json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
