const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const db = require('./database');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  // API Routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/api/drivers') {
    res.end(JSON.stringify({ success: true, drivers: db.getAllDrivers() }));
  } else if (pathname === '/api/passengers') {
    res.end(JSON.stringify({ success: true, passengers: db.getAllPassengers() }));
  } else if (pathname === '/api/rides') {
    res.end(JSON.stringify({ success: true, rides: db.getAllRides() }));
  } else if (pathname === '/health') {
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date() }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Hormozgan Driver Pro - Server running on port ${PORT}`);
});
