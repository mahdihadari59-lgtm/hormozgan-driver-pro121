const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
    timestamp: new Date().toISOString(),
    node_version: process.version
  });
});

app.get('/api', (req, res) => {
  return res.json({
    message: 'Hormozgan Driver Pro API v2.0',
    version: '2.0.0',
    endpoints: {
      health: 'GET /health',
      auth_register: 'POST /api/auth/register',
      auth_login: 'POST /api/auth/login',
      auth_me: 'GET /api/auth/me',
      drivers_list: 'GET /api/drivers',
      drivers_detail: 'GET /api/drivers/:id'
    }
  });
});

let authRoutes, driverRoutes;

try {
  authRoutes = require('./api/auth.routes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('⚠️  Auth routes not available:', error.message);
}

try {
  driverRoutes = require('./api/driver.routes');
  app.use('/api/drivers', driverRoutes);
  console.log('✅ Driver routes loaded');
} catch (error) {
  console.log('⚠️  Driver routes not available:', error.message);
}

app.use((req, res) => {
  if (!res.headersSent) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (!res.headersSent) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚗 Hormozgan Driver Pro v2.0');
  console.log('================================');
  console.log('✅ Server is ready! Press Ctrl+C to stop.');
  console.log('');
  console.log('📊 Dashboard: http://localhost:' + PORT);
  console.log('🔌 API: http://localhost:' + PORT + '/api');
  console.log('❤️  Health: http://localhost:' + PORT + '/health');
  console.log('');
});
