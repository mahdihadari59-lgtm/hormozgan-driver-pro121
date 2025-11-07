// config/database.js
const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hormozgan_driver_pro',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// ایجاد connection pool
const pool = new Pool(dbConfig);

// تابع برای اجرای کوئری‌ها
const query = (text, params) => pool.query(text, params);

// تابع برای گرفتن client جهت تراکنش
const getClient = () => pool.connect();

// هندل خطاهای connection
pool.on('error', (err, client) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// هندل connect موفق
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

module.exports = {
  query,
  getClient,
  pool
};
