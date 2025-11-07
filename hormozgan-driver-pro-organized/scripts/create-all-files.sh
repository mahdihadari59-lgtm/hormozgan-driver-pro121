#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Hormozgan Driver Pro - Creating All Files"
echo "============================================="
echo ""

# ایجاد ساختار پوشه‌ها
echo "📁 Creating directory structure..."
mkdir -p src/auth src/api src/config src/middleware src/database src/utils
mkdir -p data public docs

# ایجاد package.json
echo "📝 Creating package.json..."
cat > package.json << 'PACKAGE_EOF'
{
  "name": "hormozgan-driver-pro",
  "version": "2.0.0",
  "description": "سامانه هوشمند مدیریت رانندگان استان هرمزگان",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node src/server.js",
    "init-db": "node src/database/init.js"
  },
  "keywords": ["hormozgan", "driver", "taxi", "iran"],
  "author": "Mahdi Hadari",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^9.2.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
PACKAGE_EOF

# ایجاد .env
echo "🔐 Creating .env..."
cat > .env << 'ENV_EOF'
NODE_ENV=development
PORT=3000
JWT_SECRET=hormozgan-secret-key-change-in-production
JWT_REFRESH_SECRET=hormozgan-refresh-secret-key
DB_PATH=./data/database.sqlite
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60
ENV_EOF

# ایجاد .gitignore
echo "📋 Creating .gitignore..."
cat > .gitignore << 'GITIGNORE_EOF'
node_modules/
.env
data/*.sqlite
*.log
.DS_Store
GITIGNORE_EOF

# ایجاد src/server.js
echo "🖥️  Creating src/server.js..."
cat > src/server.js << 'SERVER_EOF'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Hormozgan Driver Pro v2.0',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hormozgan Driver Pro API v2.0',
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      drivers: {
        list: 'GET /api/drivers',
        details: 'GET /api/drivers/:id'
      }
    }
  });
});

try {
  const authRoutes = require('./api/auth.routes');
  app.use('/api/auth', authRoutes);
} catch (error) {
  console.log('Auth routes not loaded yet');
}

try {
  const driverRoutes = require('./api/driver.routes');
  app.use('/api/drivers', driverRoutes);
} catch (error) {
  console.log('Driver routes not loaded yet');
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚗 ===============================================');
  console.log('   Hormozgan Driver Pro v2.0 - Server Started');
  console.log('================================================');
  console.log('');
  console.log('📊 Dashboard: http://localhost:' + PORT);
  console.log('🔌 API:       http://localhost:' + PORT + '/api');
  console.log('❤️  Health:    http://localhost:' + PORT + '/health');
  console.log('');
  console.log('================================================');
  console.log('');
});
SERVER_EOF

# ایجاد src/config/database.js
echo "💾 Creating src/config/database.js..."
cat > src/config/database.js << 'DATABASE_EOF'
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

console.log('✅ Database connected:', dbPath);

module.exports = db;
DATABASE_EOF

# ایجاد src/database/init.js
echo "🗄️  Creating src/database/init.js..."
cat > src/database/init.js << 'INITDB_EOF'
const db = require('../config/database');

console.log('📦 Creating database tables...');
console.log('');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('driver', 'passenger', 'admin')),
      verified INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table created: users');

  db.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      license_number TEXT UNIQUE,
      vehicle_type TEXT,
      vehicle_plate TEXT,
      vehicle_color TEXT,
      rating REAL DEFAULT 5.0,
      total_rides INTEGER DEFAULT 0,
      status TEXT DEFAULT 'offline',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Table created: drivers');

  db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      passenger_id INTEGER NOT NULL,
      driver_id INTEGER,
      pickup_address TEXT,
      destination_address TEXT,
      fare REAL,
      distance REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (passenger_id) REFERENCES users(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    )
  `);
  console.log('✅ Table created: rides');

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      refresh_token TEXT NOT NULL,
      device_info TEXT,
      ip_address TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Table created: sessions');

  console.log('');
  console.log('🎉 Database initialized successfully!');
  console.log('📊 Database location: ./data/database.sqlite');
  console.log('');

} catch (error) {
  console.error('❌ Error creating tables:', error.message);
  process.exit(1);
}

db.close();
INITDB_EOF

# ایجاد src/auth/jwt.service.js
echo "🔑 Creating src/auth/jwt.service.js..."
cat > src/auth/jwt.service.js << 'JWT_EOF'
const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh';
    this.ACCESS_TOKEN_EXPIRES = '24h';
    this.REFRESH_TOKEN_EXPIRES = '7d';
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: 'hormozgan-driver-pro'
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES,
      issuer: 'hormozgan-driver-pro'
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new JwtService();
JWT_EOF

# ایجاد src/auth/auth.service.js
echo "🔐 Creating src/auth/auth.service.js..."
cat > src/auth/auth.service.js << 'AUTH_EOF'
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const jwtService = require('./jwt.service');

class AuthService {
  
  async register({ phone, password, name, role }) {
    const existingUser = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      throw new Error('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (phone, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(phone, passwordHash, name, role);

    if (role === 'driver') {
      db.prepare('INSERT INTO drivers (user_id) VALUES (?)').run(result.lastInsertRowid);
    }

    return {
      success: true,
      message: 'Registration successful',
      userId: result.lastInsertRowid
    };
  }

  async login({ phone, password }) {
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    
    if (!user) {
      throw new Error('Invalid phone or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid phone or password');
    }

    const payload = {
      userId: user.id,
      phone: user.phone,
      role: user.role
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    db.prepare(`
      INSERT INTO sessions (user_id, refresh_token, expires_at)
      VALUES (?, ?, datetime('now', '+7 days'))
    `).run(user.id, refreshToken);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    };
  }

  async getUserById(userId) {
    const user = db.prepare(`
      SELECT id, phone, name, role, verified, status, created_at
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();
AUTH_EOF

# ایجاد src/middleware/auth.middleware.js
echo "🛡️  Creating src/middleware/auth.middleware.js..."
cat > src/middleware/auth.middleware.js << 'MIDDLEWARE_EOF'
const jwtService = require('../auth/jwt.service');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

module.exports = authMiddleware;
MIDDLEWARE_EOF

# ایجاد src/api/auth.routes.js
echo "🔌 Creating src/api/auth.routes.js..."
cat > src/api/auth.routes.js << 'AUTHROUTES_EOF'
const express = require('express');
const router = express.Router();
const authService = require('../auth/auth.service');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, role } = req.body;

    if (!phone || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const result = await authService.register({ phone, password, name, role });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Phone and password are required'
      });
    }

    const result = await authService.login({ phone, password });
    res.json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
AUTHROUTES_EOF

# ایجاد src/api/driver.routes.js
echo "🚗 Creating src/api/driver.routes.js..."
cat > src/api/driver.routes.js << 'DRIVERROUTES_EOF'
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const drivers = db.prepare(`
      SELECT 
        d.id,
        u.name,
        u.phone,
        d.license_number,
        d.vehicle_type,
        d.vehicle_plate,
        d.rating,
        d.total_rides,
        d.status
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE u.status = 'active'
      ORDER BY d.rating DESC
    `).all();

    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = db.prepare(`
      SELECT 
        d.*,
        u.name,
        u.phone,
        u.created_at as user_created_at
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
DRIVERROUTES_EOF


# ایجاد README.md
echo "📖 Creating README.md..."
cat > README.md << 'README_EOF'
# 🚗 Hormozgan Driver Pro v2.0

سامانه هوشمند مدیریت رانندگان استان هرمزگان

## نصب و راه‌اندازی

### 1. نصب dependencies
```bash
pnpm install
2. ایجاد دیتابیس
npm run init-db
3. اجرای سرور
npm start
API Endpoints
Authentication
POST /api/auth/register - ثبت‌نام
POST /api/auth/login - ورود
GET /api/auth/me - اطلاعات کاربر
Drivers
GET /api/drivers - لیست رانندگان
GET /api/drivers/:id - اطلاعات یک راننده
Technologies
Node.js + Express
SQLite (better-sqlite3)
JWT Authentication
bcryptjs
Author
Mahdi Hadari
README_EOF
echo ""
echo "✅ All files created successfully!"
echo ""
echo "Next steps:"
echo "1. pnpm install"
echo "2. npm run init-db"
echo "3. npm start"
echo ""
