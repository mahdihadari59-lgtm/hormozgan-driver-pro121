const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'تعداد درخواست‌های شما بیش از حد مجاز است',
    retryAfter: 15
  }
});

app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

// Database
const users = [];
const drivers = [];
const trips = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'passenger-request.html'));
});

app.get('/festivals', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'festivals.html'));
});

app.get('/worlddays', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'worlddays.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'سرور Hormozgan Driver Pro فعال است',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    users: users.length,
    drivers: drivers.length,
    trips: trips.length
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullname, phone, email, password, userType, carType, carPlate, licenseNumber } = req.body;

    if (!fullname || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'نام، شماره موبایل و رمز عبور الزامی است'
      });
    }

    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'این شماره موبایل قبلاً ثبت شده است'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: users.length + 1,
      fullname,
      phone,
      email: email || null,
      password: hashedPassword,
      userType: userType || 'passenger',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    if (userType === 'driver') {
      user.carType = carType;
      user.carPlate = carPlate;
      user.licenseNumber = licenseNumber;
      user.rating = 5.0;
      user.trips = 0;

      drivers.push({
        id: drivers.length + 1,
        fullname,
        phone,
        location: { lat: 27.1832, lng: 56.2666 },
        rating: 5.0,
        vehicle: carType,
        plate: carPlate,
        status: 'offline',
        trips: 0
      });
    }

    users.push(user);

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, userType: user.userType },
      process.env.JWT_SECRET || 'hormozgan_driver_pro_secret_2025',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
        userType: user.userType,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت‌نام'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'شماره موبایل و رمز عبور الزامی است'
      });
    }

    const user = users.find(u => u.phone === phone);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'شماره موبایل یا رمز عبور اشتباه است'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'شماره موبایل یا رمز عبور اشتباه است'
      });
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, userType: user.userType },
      process.env.JWT_SECRET || 'hormozgan_driver_pro_secret_2025',
      { expiresIn: '30d' }
    );

    if (user.userType === 'driver') {
      const driver = drivers.find(d => d.phone === phone);
      if (driver) {
        driver.status = 'online';
      }
    }

    res.json({
      success: true,
      message: 'ورود با موفقیت انجام شد',
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
        userType: user.userType,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ورود'
    });
  }
});

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'دسترسی غیرمجاز - توکن مورد نیاز است'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hormozgan_driver_pro_secret_2025');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'توکن نامعتبر است'
    });
  }
}

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'کاربر یافت نشد'
    });
  }

  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Nearby drivers
app.get('/api/drivers/nearby', (req, res) => {
  const { lat = 27.1832, lng = 56.2666 } = req.query;
  
  const nearbyDrivers = drivers
    .filter(d => d.status === 'online')
    .map(driver => {
      const distance = Math.random() * 3;
      return {
        ...driver,
        distance: distance.toFixed(1),
        eta: Math.ceil(distance * 2)
      };
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  res.json({
    success: true,
    data: {
      drivers: nearbyDrivers,
      count: nearbyDrivers.length,
      userLocation: { lat: parseFloat(lat), lng: parseFloat(lng) }
    }
  });
});

// Request ride
app.post('/api/request-ride', authenticateToken, (req, res) => {
  const { pickup, destination, notes } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({
      success: false,
      error: 'مبدا و مقصد الزامی است'
    });
  }

  const availableDrivers = drivers.filter(d => d.status === 'online');
  
  if (availableDrivers.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'در حال حاضر راننده‌ای در دسترس نیست'
    });
  }

  const selectedDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
  const estimatedFare = Math.floor(Math.random() * 30000) + 25000;
  const eta = Math.floor(Math.random() * 8) + 3;

  const trip = {
    id: trips.length + 1,
    passengerId: req.user.userId,
    driverId: selectedDriver.id,
    pickup,
    destination,
    notes,
    fare: estimatedFare,
    eta: eta,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  trips.push(trip);

  res.json({
    success: true,
    message: 'راننده پیدا شد!',
    data: {
      trip,
      driver: {
        id: selectedDriver.id,
        fullname: selectedDriver.fullname,
        rating: selectedDriver.rating,
        vehicle: selectedDriver.vehicle,
        plate: selectedDriver.plate,
        phone: selectedDriver.phone
      },
      estimatedFare,
      eta
    }
  });
});

// User trips
app.get('/api/user/trips', authenticateToken, (req, res) => {
  const userTrips = trips.filter(t => 
    t.passengerId === req.user.userId || t.driverId === req.user.userId
  );

  res.json({
    success: true,
    data: {
      trips: userTrips,
      count: userTrips.length
    }
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalDrivers: drivers.length,
      onlineDrivers: drivers.filter(d => d.status === 'online').length,
      activeTrips: trips.filter(t => t.status === 'active').length,
      totalTrips: trips.length,
      totalEarnings: trips.reduce((sum, trip) => sum + (trip.fare || 0), 0)
    }
  });
});

// Driver status
app.post('/api/driver/status', authenticateToken, (req, res) => {
  const { status } = req.body;

  if (req.user.userType !== 'driver') {
    return res.status(403).json({
      success: false,
      error: 'فقط رانندگان می‌توانند وضعیت خود را تغییر دهند'
    });
  }

  const driver = drivers.find(d => d.phone === req.user.phone);
  
  if (!driver) {
    return res.status(404).json({
      success: false,
      error: 'راننده یافت نشد'
    });
  }

  driver.status = status;

  res.json({
    success: true,
    message: 'وضعیت به ' + (status === 'online' ? 'آنلاین' : 'آفلاین') + ' تغییر کرد',
    data: { status }
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'صفحه مورد نظر یافت نشد',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'خطای داخلی سرور',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🎊 Hormozgan Driver Pro v3.0.0     ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║   🚀 سرور روی پورت ' + PORT + ' اجرا شد        ║');
  console.log('║                                        ║');
  console.log('║   📱 لینک‌ها:                          ║');
  console.log('║   🏠 http://localhost:' + PORT + '/              ║');
  console.log('║   🔐 http://localhost:' + PORT + '/register.html ║');
  console.log('║   🔓 http://localhost:' + PORT + '/login.html    ║');
  console.log('║   🎉 http://localhost:' + PORT + '/festivals     ║');
  console.log('║                                        ║');
  console.log('║   ✅ آماده دریافت درخواست!            ║');
  console.log('╚════════════════════════════════════════╝');
});
