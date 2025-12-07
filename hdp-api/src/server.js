const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Import database sync
const { syncDatabase } = require('./models');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const driverRoutes = require('./routes/driver');
const tripRoutes = require('./routes/trip');

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'هرمزگان درایور API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/trip', tripRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطای سرور'
  });
});

// Start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║    🚀 هرمزگان درایور HDP - API سرور      ║
╚══════════════════════════════════════════╝
📡 پورت: ${PORT}
🌐 محیط: ${process.env.NODE_ENV || 'development'}
🔧 API: http://localhost:${PORT}/api/health
📱 ورود: /api/auth/login
🚗 راننده: /api/driver

✅ سرور فعال و آماده...
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
