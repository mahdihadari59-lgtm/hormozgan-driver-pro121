const express = require('express');
const router = express.Router();
const TourismService = require('../services/TourismService');

const tourismService = new TourismService();

// دریافت مکان‌های گردشگری
router.get('/spots/nearby', async (req, res) => {
    try {
        const { lat, lng, type, freeEntrance } = req.query;
        const filters = {};
        if (type) filters.type = type;
        if (freeEntrance) filters.freeEntrance = freeEntrance === 'true';

        const spots = await tourismService.getNearbyTouristSpots(
            parseFloat(lat) || 27.1833,
            parseFloat(lng) || 56.2667,
            5000,
            filters
        );

        res.json({ success: true, data: spots });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در دریافت مکان‌ها' });
    }
});

// دریافت تورها
router.get('/tours', async (req, res) => {
    try {
        const tours = await tourismService.getAvailableTours();
        res.json({ success: true, data: tours });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در دریافت تورها' });
    }
});

// رزرو تور
router.post('/tours/book', async (req, res) => {
    try {
        const result = await tourismService.bookTour(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در رزرو تور' });
    }
});

module.exports = router;
