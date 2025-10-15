const http = require('http');

// Database Simulation
const drivers = [
  { id: 1, name: 'علی محمدی', phone: '09121234567', car: 'پژو 206', rating: 4.8, status: 'available', location: { lat: 27.1865, lng: 56.2768 } },
  { id: 2, name: 'حسن رضایی', phone: '09131234567', car: 'سمند', rating: 4.9, status: 'busy', location: { lat: 27.1900, lng: 56.2800 } },
  { id: 3, name: 'محمد احمدی', phone: '09141234567', car: 'دنا', rating: 4.7, status: 'available', location: { lat: 27.1850, lng: 56.2750 } }
];

const passengers = [
  { id: 1, name: 'فاطمه کریمی', phone: '09151234567', trips: 45, rating: 4.9 },
  { id: 2, name: 'مریم نوری', phone: '09161234567', trips: 32, rating: 4.8 },
  { id: 3, name: 'زهرا حسینی', phone: '09171234567', trips: 67, rating: 5.0 }
];

const rides = [
  { id: 1, driver_id: 2, passenger_id: 1, from: 'میدان آزادی', to: 'بندر عباس', status: 'active', price: 150000 },
  { id: 2, driver_id: 1, passenger_id: 3, from: 'فرودگاه', to: 'مرکز شهر', status: 'completed', price: 200000 }
];

const server = http.createServer((req, res) => {
  const timestamp = new Date().toLocaleTimeString('fa-IR');
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });

  let response;

  switch(req.url) {
    case '/':
      response = {
        message: '🚕 Hormozgan Driver Pro API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
          main: '/',
          health: '/health',
          drivers: '/api/drivers',
          passengers: '/api/passengers',
          rides: '/api/rides',
          stats: '/api/stats',
          search: '/api/search/nearby'
        }
      };
      break;

    case '/health':
      response = {
        status: 'ok ✅',
        uptime: Math.floor(process.uptime()) + ' seconds',
        memory: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        timestamp: new Date().toISOString(),
        node_version: process.version
      };
      break;

    case '/api/drivers':
      response = {
        success: true,
        total: drivers.length,
        available: drivers.filter(d => d.status === 'available').length,
        drivers: drivers
      };
      break;

    case '/api/passengers':
      response = {
        success: true,
        total: passengers.length,
        passengers: passengers
      };
      break;

    case '/api/rides':
      response = {
        success: true,
        active: rides.filter(r => r.status === 'active').length,
        completed: rides.filter(r => r.status === 'completed').length,
        rides: rides
      };
      break;

    case '/api/stats':
      response = {
        total_drivers: drivers.length,
        active_drivers: drivers.filter(d => d.status === 'available').length,
        total_passengers: passengers.length,
        active_rides: rides.filter(r => r.status === 'active').length,
        completed_rides: rides.filter(r => r.status === 'completed').length,
        total_revenue_today: '۲,۳۵۰,۰۰۰ تومان',
        platform: 'Hormozgan'
      };
      break;

    case '/api/search/nearby':
      const nearbyDrivers = drivers.filter(d => d.status === 'available');
      response = {
        success: true,
        location: { city: 'بندرعباس', region: 'هرمزگان' },
        radius: '5 km',
        found: nearbyDrivers.length,
        drivers: nearbyDrivers
      };
      break;

    case '/api/status':
      response = {
        service: 'Hormozgan Driver Pro',
        status: 'active',
        environment: 'production',
        host: '0.0.0.0',
        port: 3000
      };
      break;

    default:
      res.writeHead(404);
      response = {
        error: 'Not Found',
        message: `Route ${req.url} does not exist`,
        available_routes: ['/', '/health', '/api/drivers', '/api/passengers', '/api/rides', '/api/stats', '/api/search/nearby']
      };
  }

  res.end(JSON.stringify(response, null, 2));
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '═'.repeat(70));
  console.log('🚕  Hormozgan Driver Pro API Server v1.0');
  console.log('═'.repeat(70));
  console.log(`📡  Server URL: http://localhost:${PORT}`);
  console.log(`📅  Started: ${new Date().toLocaleString('fa-IR')}`);
  console.log(`💾  Drivers: ${drivers.length} | Passengers: ${passengers.length} | Rides: ${rides.length}`);
  console.log('\n🔗  Available Endpoints:');
  console.log('    → GET  /                      (Main Info)');
  console.log('    → GET  /health                (Health Check)');
  console.log('    → GET  /api/drivers           (All Drivers)');
  console.log('    → GET  /api/passengers        (All Passengers)');
  console.log('    → GET  /api/rides             (All Rides)');
  console.log('    → GET  /api/stats             (Statistics)');
  console.log('    → GET  /api/search/nearby     (Nearby Drivers)');
  console.log('    → GET  /api/status            (Server Status)');
  console.log('═'.repeat(70));
  console.log('✅  Server is ready! Press Ctrl+C to stop.\n');
});

process.on('SIGINT', () => {
  console.log('\n\n👋  Shutting down...');
  server.close(() => {
    console.log('✅  Server stopped');
    process.exit(0);
  });
});
