const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// ذخیره موقعیت‌های لحظه‌ای رانندگان
const driverLocations = new Map();

wss.on('connection', (ws) => {
  console.log('🔌 اتصال جدید WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'driver_location') {
        // به‌روزرسانی موقعیت راننده
        driverLocations.set(data.driverId, {
          lat: data.lat,
          lng: data.lng,
          timestamp: Date.now()
        });
        
        // ارسال به همه کلاینت‌ها
        broadcast({
          type: 'location_update',
          driverId: data.driverId,
          lat: data.lat,
          lng: data.lng
        });
      }
      
      if (data.type === 'get_drivers') {
        // ارسال لیست رانندگان نزدیک
        const nearbyDrivers = getNearbyDrivers(data.lat, data.lng, data.radius || 5);
        ws.send(JSON.stringify({
          type: 'drivers_list',
          drivers: nearbyDrivers
        }));
      }
      
    } catch (error) {
      console.error('❌ خطای WebSocket:', error);
    }
  });
});

function getNearbyDrivers(lat, lng, radiusKm) {
  const drivers = [];
  
  driverLocations.forEach((location, driverId) => {
    const distance = calculateDistance(lat, lng, location.lat, location.lng);
    
    if (distance <= radiusKm) {
      drivers.push({
        driverId,
        ...location,
        distance: distance.toFixed(2)
      });
    }
  });
  
  return drivers;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  // محاسبه فاصله با فرمول Haversine
  const R = 6371; // شعاع زمین به کیلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log('🔌 سرور WebSocket روی پورت 8080 راه‌اندازی شد');
