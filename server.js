const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ==================== ROUTES ====================

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Map page
app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// ==================== API ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'سرور Hormozgan Driver Pro فعال است',
        timestamp: new Date().toISOString(),
        version: '2.1.0'
    });
});

// Dashboard Statistics
app.get('/api/dashboard/stats', (req, res) => {
    res.json({
        totalDrivers: 156,
        onlineDrivers: 42,
        activeTrips: 18,
        totalEarnings: 12540000,
        systemStatus: 'operational'
    });
});

// Nearby Drivers - برای نقشه
app.get('/api/drivers/nearby', (req, res) => {
    const lat = parseFloat(req.query.lat) || 27.1832;
    const lng = parseFloat(req.query.lng) || 56.2666;
    
    const drivers = [
        {
            id: 1,
            name: "رضا محمدی",
            lat: lat + (Math.random() - 0.5) * 0.02,
            lng: lng + (Math.random() - 0.5) * 0.02,
            rating: 4.8,
            vehicle: "پراید سفید",
            status: "online"
        },
        {
            id: 2,
            name: "علی کریمی", 
            lat: lat + (Math.random() - 0.5) * 0.02,
            lng: lng + (Math.random() - 0.5) * 0.02,
            rating: 4.9,
            vehicle: "پژو 206",
            status: "online"
        },
        {
            id: 3,
            name: "محمد حسینی",
            lat: lat + (Math.random() - 0.5) * 0.02,
            lng: lng + (Math.random() - 0.5) * 0.02,
            rating: 4.7,
            vehicle: "سمند",
            status: "online"
        },
        {
            id: 4,
            name: "احمد قریشی",
            lat: lat + (Math.random() - 0.5) * 0.02,
            lng: lng + (Math.random() - 0.5) * 0.02,
            rating: 4.6,
            vehicle: "تیبا",
            status: "online"
        }
    ];
    
    res.json({
        success: true,
        drivers: drivers,
        count: drivers.length
    });
});

// Online Drivers List
app.get('/api/drivers/online', (req, res) => {
    res.json({
        success: true,
        drivers: [
            { id: 1, name: "رضا محمدی", location: "بندرعباس", rating: 4.8 },
            { id: 2, name: "علی کریمی", location: "قشم", rating: 4.9 },
            { id: 3, name: "محمد حسینی", location: "میناب", rating: 4.7 },
            { id: 4, name: "احمد قریشی", location: "بندرعباس", rating: 4.6 }
        ]
    });
});

// Route Calculation
app.post('/api/route/calculate', (req, res) => {
    const { startLat, startLng, endLat, endLng } = req.body;
    
    // محاسبه فاصله
    const distance = Math.random() * 20 + 5; // 5-25 km
    const duration = Math.round((distance / 40) * 60);
    const cost = Math.round(distance * 10000);
    
    res.json({
        success: true,
        distance: distance.toFixed(2),
        duration: duration,
        estimatedCost: cost
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "صفحه مورد نظر یافت نشد",
        path: req.path
    });
});

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
✨ ========================================
🚀 سرور Hormozgan Driver Pro راه‌اندازی شد
📍 پورت: ${PORT}
🌍 آدرس: http://localhost:${PORT}
🗺️ نقشه: http://localhost:${PORT}/map
📊 داشبورد: http://localhost:${PORT}/dashboard
🏥 سلامت: http://localhost:${PORT}/health
✨ ========================================
    `);
});
