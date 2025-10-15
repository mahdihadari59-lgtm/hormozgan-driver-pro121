const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`[${new Date().toLocaleTimeString('fa-IR')}] ${req.method} ${pathname}`);

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    serveStatic(req, res, path.join(__dirname, 'public', 'index.html'));
    return;
  }

  if (pathname.startsWith('/public/')) {
    serveStatic(req, res, path.join(__dirname, pathname));
    return;
  }

  // API Routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  let response;

  try {
    switch(pathname) {
      case '/api/drivers':
        if (req.method === 'GET') {
          const drivers = db.getAllDrivers();
          response = {
            success: true,
            total: drivers.length,
            available: drivers.filter(d => d.status === 'available').length,
            drivers
          };
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const newDriver = JSON.parse(body);
            const result = db.addDriver(newDriver);
            res.end(JSON.stringify({ success: true, driver: result }));
          });
          return;
        }
        break;

      case '/api/passengers':
        response = {
          success: true,
          passengers: db.getAllPassengers()
        };
        break;

      case '/api/rides':
        response = {
          success: true,
          rides: db.getAllRides()
        };
        break;

      case '/api/stats':
        const drivers = db.getAllDrivers();
        const passengers = db.getAllPassengers();
        const rides = db.getAllRides();
        
        response = {
          success: true,
          drivers: {
            total: drivers.length,
            available: drivers.filter(d => d.status === 'available').length,
            busy: drivers.filter(d => d.status === 'busy').length,
            offline: drivers.filter(d => d.status === 'offline').length
          },
          passengers: {
            total: passengers.length
          },
          rides: {
            total: rides.length,
            active: rides.filter(r => r.status === 'active').length,
            completed: rides.filter(r => r.status === 'completed').length
          }
        };
        break;

      case '/health':
        response = {
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        };
        break;

      default:
        if (pathname.match(/^\/api\/drivers\/\d+$/)) {
          const id = pathname.split('/').pop();
          const driver = db.getDriverById(id);
          if (driver) {
            response = { success: true, driver };
          } else {
            res.statusCode = 404;
            response = { success: false, error: 'Driver not found' };
          }
        } else {
          res.statusCode = 404;
          response = { success: false, error: 'Route not found' };
        }
    }

    res.end(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '═'.repeat(80));
  console.log('🚕  Hormozgan Driver Pro v2.0 - با دیتابیس و Frontend');
  console.log('═'.repeat(80));
  console.log(`📡  Server: http://localhost:${PORT}`);
  console.log(`🌐  Frontend: http://localhost:${PORT}/`);
  console.log(`📊  API: http://localhost:${PORT}/api/`);
  console.log('═'.repeat(80));
  console.log('✅  Server is ready!\n');
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  process.exit(0);
});

module.exports = server;
