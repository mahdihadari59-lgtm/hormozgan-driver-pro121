const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const drivers = db.prepare(`
      SELECT 
        d.id,
        u.name,
        u.phone,
        d.license_number,
        d.vehicle_type,
        d.vehicle_plate,
        d.rating,
        d.total_rides,
        d.status
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE u.status = 'active'
      ORDER BY d.rating DESC
    `).all();

    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = db.prepare(`
      SELECT 
        d.*,
        u.name,
        u.phone,
        u.created_at as user_created_at
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
