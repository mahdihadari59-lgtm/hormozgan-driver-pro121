// apps/map-service/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// نقشه تعاملی
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// WebSocket برای ردیابی لحظه‌ای
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log(`🗺️  New map connection: ${socket.id}`);
  
  socket.on('map:init', (data) => {
    const { userId, userType, location } = data;
    activeConnections.set(socket.id, { userId, userType, location });
    
    // ارسال موقعیت اولیه
    socket.emit('map:data', {
      type: 'initial',
      center: [27.1833, 56.2667], // بندرعباس
      zoom: 12,
      bounds: [
        [27.0, 56.1],
        [27.3, 56.4]
      ]
    });
  });
  
  // به‌روزرسانی موقعیت
  socket.on('location:update', (data) => {
    const { location, userId } = data;
    
    if (activeConnections.has(socket.id)) {
      activeConnections.get(socket.id).location = location;
      
      // ارسال به سایر کاربران
      socket.broadcast.emit('user:moved', {
        userId,
        location,
        timestamp: Date.now()
      });
    }
  });
  
  // دریافت رانندگان نزدیک
  socket.on('map:get-nearby-drivers', async (data) => {
    const { lat, lng, radius = 2000 } = data;
    
    // شبیه‌سازی داده رانندگان
    const nearbyDrivers = [
      {
        id: 1,
        name: 'محمد احمدی',
        location: [27.1865, 56.2778],
        rating: 4.8,
        distance: 1200,
        eta: '5 دقیقه'
      },
      {
        id: 2, 
        name: 'علی رضایی',
        location: [27.1875, 56.2788],
        rating: 4.9,
        distance: 800,
        eta: '3 دقیقه'
      }
    ];
    
    socket.emit('map:nearby-drivers', nearbyDrivers);
  });
  
  socket.on('disconnect', () => {
    activeConnections.delete(socket.id);
    console.log(`🗺️  Map disconnected: ${socket.id}`);
  });
});

// API برای نقشه
app.get('/api/map/tile/:z/:x/:y', (req, res) => {
  // شبیه‌سازی tile server
  // در پروژه واقعی از OpenStreetMap یا Mapbox استفاده می‌شود
  res.json({
    success: true,
    tile: {
      z: req.params.z,
      x: req.params.x, 
      y: req.params.y,
      url: `https://tile.openstreetmap.org/${req.params.z}/${req.params.x}/${req.params.y}.png`
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Map Service',
    leaflet: 'active',
    activeConnections: activeConnections.size,
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🗺️  Hormozgan Map Service              ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   📍 Port: ${PORT}                            ║`);
  console.log('║   ✅ Leaflet.js: Active                   ║');
  console.log('║   🌐 WebSocket Tracking: Ready            ║');
  console.log('╚════════════════════════════════════════════╝');
});
