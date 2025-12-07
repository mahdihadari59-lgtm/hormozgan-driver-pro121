```
==============================================
# HDP Auto Setup - Hormozgan Driver Platform
# Complete Installation Script for Termux
# ==============================================

clear
echo -e "\033[1;36m"
echo "╔════════════════════════════════════════╗"
echo "║    🚀 هرمزگان درایور HDP - نصب خودكار    ║"
echo "╚════════════════════════════════════════╝"
echo -e "\033[0m"
sleep 2

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function for colored output
print_status() {
    echo -e "${CYAN}[*]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Step 1: Update Termux
print_status "بروزرسانی Termux..."
pkg update -y && pkg upgrade -y
if [ $? -eq 0 ]; then
    print_success "Termux بروزرسانی شد"
else
    print_error "خطا در بروزرسانی"
    exit 1
fi

# Step 2: Install Required Packages
print_status "نصب پکیج‌های مورد نیاز..."
pkg install -y nodejs git wget curl python make g++ \
    yarn openssl-tool vim nano termux-api mysql \
    nginx termux-services -y

print_success "پکیج‌ها نصب شدند"

# Step 3: Install PM2
print_status "نصب PM2..."
npm install -g pm2
print_success "PM2 نصب شد"

# Step 4: Create Project Directory
print_status "ایجاد دایرکتوری پروژه..."
cd ~
mkdir -p hdp-project/{frontend,backend,database,nginx,ssl,logs}
cd hdp-project
print_success "دایرکتوری ایجاد شد"

# Step 5: Create Frontend Structure
print_status "ایجاد ساختار Frontend..."
cd frontend

# Create package.json
cat > package.json << 'PJSON'
{
  "name": "hdp-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.1",
    "react-hot-toast": "^2.4.1"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.5.0"
  }
}
PJSON

# Create vite.config.js
cat > vite.config.js << 'VITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
VITE

# Create index.html
cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>هرمزگان درایور HDP</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
HTML

# Create src directory structure
mkdir -p src/{components,pages,utils}
mkdir -p public

# Create main App
cat > src/App.jsx << 'APP'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 هرمزگان درایور HDP</h1>
        <p style={styles.subtitle}>سیستم هوشمند حمل و نقل استان هرمزگان</p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.icon}>🚗</div>
            <h3>سرویس سریع</h3>
            <p>درخواست راننده در ۵ دقیقه</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.icon}>🔒</div>
            <h3>امنیت کامل</h3>
            <p>رانندگان تأیید شده</p>
          </div>
          <div style={styles.feature}>
            <div style={styles.icon}>🤖</div>
            <h3>هوش مصنوعی</h3>
            <p>دستیار هوشمند ساحل پرو</p>
          </div>
        </div>

        <button style={styles.button}>
          شروع استفاده از سرویس
        </button>
      </div>
      <Toaster />
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0047AB 0%, #00A8E8 50%, #FF8C42 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%'
  },
  title: {
    color: '#0047AB',
    fontSize: '2.5rem',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.2rem',
    marginBottom: '40px'
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px'
  },
  feature: {
    flex: '1',
    minWidth: '150px'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  button: {
    background: '#0047AB',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    fontSize: '1.2rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  }
}

export default App
APP

# Create main.jsx
cat > src/main.jsx << 'MAIN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
MAIN

print_success "Frontend ایجاد شد"

# Step 6: Install Frontend Dependencies
print_status "نصب وابستگی‌های Frontend..."
npm install
print_success "وابستگی‌ها نصب شدند"

# Step 7: Build Frontend
print_status "ساخت Frontend..."
npm run build
print_success "Frontend ساخته شد"

# Step 8: Create Backend
print_status "ایجاد Backend..."
cd ../backend

# Create package.json
cat > package.json << 'BPJSON'
{
  "name": "hdp-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
BPJSON

# Create server.js
cat > server.js << 'SERVER'
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'HDP API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body
  const otp = Math.floor(100000 + Math.random() * 900000)
  
  res.json({
    success: true,
    message: 'کد تأیید ارسال شد',
    otp: otp
  })
})

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body
  
  res.json({
    success: true,
    token: 'jwt-token-' + Date.now(),
    user: {
      id: 1,
      phone: phone,
      name: 'کاربر تستی',
      role: 'user'
    }
  })
})

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('join', (room) => {
    socket.join(room)
    console.log(`User joined room: ${room}`)
  })
  
  socket.on('driver:location', (data) => {
    io.emit('location:update', data)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 WebSocket ready`)
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`)
})
SERVER

# Create .env
cat > .env << 'ENV'
PORT=8000
JWT_SECRET=HDP-Secret-Key-2025
NODE_ENV=production
ENV

print_success "Backend ایجاد شد"

# Step 9: Install Backend Dependencies
print_status "نصب وابستگی‌های Backend..."
npm install
print_success "وابستگی‌ها نصب شدند"

# Step 10: Create Nginx Config
print_status "تنظیم Nginx..."
cd ../nginx

cat > hdp.conf << 'NGINX'
server {
    listen 8080;
    server_name localhost;
    
    location / {
        root /data/data/com.termux/files/home/hdp-project/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
NGINX

print_success "Nginx تنظیم شد"

# Step 11: Create Database Setup
print_status "تنظیم پایگاه داده..."
cd ../database

cat > init.sql << 'SQL'
-- Create database
CREATE DATABASE IF NOT EXISTS hdp_db;
USE hdp_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    role ENUM('user', 'driver', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO users (phone, name, role) VALUES
('09123456789', 'کاربر نمونه', 'user'),
('09129876543', 'راننده نمونه', 'driver'),
('09350000000', 'ادمین', 'admin');
SQL

print_success "پایگاه داده تنظیم شد"

# Step 12: Create SSL Certificates
print_status "ایجاد گواهی SSL..."
cd ../ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/C=IR/ST=Hormozgan/L=Bandar Abbas/O=HDP/CN=localhost"

print_success "گواهی SSL ایجاد شد"

# Step 13: Create Startup Script
print_status "ایجاد اسکریپت راه‌اندازی..."
cd ..

cat > start-hdp.sh << 'START'
#!/bin/bash

echo "🚀 راه‌اندازی هرمزگان درایور HDP..."
echo

# Start Backend
echo "🔧 شروع Backend..."
cd ~/hdp-project/backend
pm2 start server.js --name hdp-backend

# Start Nginx
echo "🌐 شروع Nginx..."
nginx -c ~/hdp-project/nginx/hdp.conf

# Start MySQL
echo "🗄️ شروع MySQL..."
mysqld_safe &

# Show status
echo
echo "✅ سرویس‌ها راه‌اندازی شدند"
echo
echo "📊 وضعیت سرویس‌ها:"
pm2 list
echo
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:8000"
echo "📡 WebSocket: ws://localhost:8000"
echo
echo "📝 دستورات مدیریت:"
echo "• مشاهده لاگ‌ها: pm2 logs"
echo "• ری‌استارت: pm2 restart all"
echo "• توقف: pm2 stop all"
echo "• خروج: exit"
START

chmod +x start-hdp.sh

cat > stop-hdp.sh << 'STOP'
#!/bin/bash

echo "🛑 توقف هرمزگان درایور HDP..."
echo

pm2 stop all
pm2 delete all
nginx -s stop
pkill mysql

echo "✅ تمام سرویس‌ها متوقف شدند"
STOP

chmod +x stop-hdp.sh

cat > status-hdp.sh << 'STATUS'
#!/bin/bash

echo "📊 وضعیت هرمزگان درایور HDP"
echo "==========================="
echo

echo "1. فرآیند‌های PM2:"
pm2 list
echo

echo "2. مصرف حافظه:"
free -h
echo

echo "3. پورت‌های فعال:"
netstat -tulpn | grep -E ':8080|:8000'
echo

echo "4. لاگ‌های اخیر Backend:"
tail -10 ~/.pm2/logs/hdp-backend-out.log 2>/dev/null || echo "لاگی یافت نشد"
echo

echo "✅ سیستم فعال است"
STATUS

chmod +x status-hdp.sh

print_success "اسکریپت‌ها ایجاد شدند"

# Step 14: Create Auto-start Service
print_status "تنظیم سرویس خودکار..."
cat > /data/data/com.termux/files/usr/etc/profile.d/hdp-start.sh << 'AUTO'
#!/bin/bash

# Auto start HDP on Termux start
if [ -f ~/hdp-project/start-hdp.sh ]; then
    echo "🚀 راه‌اندازی خودکار HDP..."
    ~/hdp-project/start-hdp.sh > ~/hdp-project/logs/startup.log 2>&1 &
fi
AUTO

chmod +x /data/data/com.termux/files/usr/etc/profile.d/hdp-start.sh

# Step 15: Final Setup
print_status "پایان نصب..."
cd ~/hdp-project

# Create README
cat > README.md << 'README'
# 🚀 هرمزگان درایور

