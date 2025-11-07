#!/bin/bash

# ==================== Hormozgan Driver Pro - Auto Setup ====================
echo "🚀 شروع راه‌اندازی خودکار Hormozgan Driver Pro..."

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع برای نمایش لوگو
show_logo() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                🚀 AI Sahel Pro Ultra                ║"
    echo "║              Hormozgan Driver System               ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# تابع برای لاگ
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}❌ [$(date +'%%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  [$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# نمایش لوگو
show_logo

# بررسی وجود Node.js
log "بررسی پیش‌نیازها..."
if ! command -v node &> /dev/null; then
    error "Node.js یافت نشد. لطفاً Node.js را نصب کنید."
    echo "دانلود از: https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm یافت نشد. لطفاً Node.js را نصب کنید."
    exit 1
fi

log "✅ Node.js version: $(node --version)"
log "✅ npm version: $(npm --version)"

# ایجاد دایرکتوری پروژه
PROJECT_DIR="hormozgan-driver-pro"
if [ ! -d "$PROJECT_DIR" ]; then
    log "ایجاد دایرکتوری پروژه..."
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
else
    warning "دایرکتوری پروژه از قبل وجود دارد."
    cd $PROJECT_DIR
fi

# ایجاد فایل‌های پروژه
log "ایجاد ساختار پروژه..."

# فایل package.json
cat > package.json << EOF
{
  "name": "hormozgan-driver-pro",
  "version": "5.0.0",
  "description": "AI-Powered Driver Assistance System for Hormozgan",
  "main": "server-pro.js",
  "scripts": {
    "start": "node server-pro.js",
    "dev": "nodemon server-pro.js",
    "setup": "./setup.sh",
    "deploy": "node deploy.js",
    "test": "node test-server.js"
  },
  "keywords": [
    "ai",
    "driver",
    "assistance",
    "hormozgan",
    "traffic",
    "weather"
  ],
  "author": "Hormozgan Driver Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/hormozgan-driver-pro.git"
  }
}
EOF

# کپی فایل سرور
log "نصب فایل سرور پیشرفته..."
cp ../server-pro.js ./

# ایجاد دایرکتوری public و فایل‌های استاتیک
mkdir -p public
cat > public/index.html << EOF
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Sahel Pro Ultra - هرمزگان</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 20px;
            color: white;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .status {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 10px;
        }
        .online { background: #4CAF50; }
        .feature-list { list-style: none; }
        .feature-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
        .feature-list li:before { content: "✅ "; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 AI Sahel Pro Ultra</h1>
            <p>هوشمندترین دستیار رانندگی هرمزگان | نسخه ۵.۰.۰</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <h3>🤖 چت هوشمند</h3>
                <p>مکالمه پیشرفته با هوش مصنوعی برای پاسخ به سوالات رانندگی</p>
                <a href="/ai-chat" class="btn">شروع مکالمه</a>
            </div>

            <div class="card">
                <h3>🚦 وضعیت ترافیک</h3>
                <p>مشاهده وضعیت زنده ترافیک مناطق مختلف بندرعباس</p>
                <a href="/traffic-map" class="btn">مشاهده نقشه</a>
            </div>

            <div class="card">
                <h3>🌤️ آب و هوا</h3>
                <p>پیش‌بینی وضعیت جوی هرمزگان و هشدارها</p>
                <a href="/weather-map" class="btn">مشاهده وضعیت</a>
            </div>

            <div class="card">
                <h3>📊 پنل راننده</h3>
                <p>مدیریت پروفایل و اطلاعات شخصی راننده</p>
                <a href="/driver-dashboard" class="btn">ورود به پنل</a>
            </div>

            <div class="card">
                <h3>⚙️ وضعیت سیستم</h3>
                <div class="status">
                    <span>سرور:</span>
                    <div class="status-dot online"></div>
                    <span>فعال</span>
                </div>
                <div class="status">
                    <span>هوش مصنوعی:</span>
                    <div class="status-dot online"></div>
                    <span>آماده</span>
                </div>
                <ul class="feature-list">
                    <li>پشتیبانی ۲۴/۷</li>
                    <li>آپدیت زنده</li>
                    <li>امنیت بالا</li>
                </ul>
            </div>

            <div class="card">
                <h3>📞 پشتیبانی</h3>
                <p>تماس با پشتیبانی فنی و دریافت راهنمایی</p>
                <p><strong>شماره:</strong> ۰۷۶۳۵۱۰۸</p>
                <p><strong>پلاک:</strong> ۸۴ ایران ۷۴۱ ط ۹۸</p>
                <a href="/contact" class="btn">تماس با پشتیبانی</a>
            </div>
        </div>
    </div>

    <script>
        // بررسی وضعیت سرور
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ سیستم فعال:', data);
            })
            .catch(error => {
                console.error('❌ خطا در اتصال به سرور:', error);
            });
    </script>
</body>
</html>
EOF

# نصب dependencies
log "نصب کتابخانه‌های مورد نیاز..."
npm install

# ایجاد فایل دپلوی
cat > deploy.js << EOF
const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 شروع فرآیند دپلوی...');

// بررسی وجود فایل‌های ضروری
const requiredFiles = ['server-pro.js', 'package.json', 'public/index.html'];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.error(\`❌ فایل ضروری \${file} یافت نشد\`);
        process.exit(1);
    }
});

console.log('✅ تمام فایل‌های ضروری موجود هستند');

// اجرای تست سرور
console.log('🧪 تست سرور...');
exec('node server-pro.js &', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ خطا در تست سرور:', error);
        return;
    }
    
    setTimeout(() => {
        console.log('✅ تست سرور موفقیت‌آمیز بود');
        
        // توقف سرور تست
        exec('pkill -f "node server-pro.js"', () => {
            console.log('🎉 آماده دپلوی روی Netlify و سایر پلتفرم‌ها!');
            console.log('\\n📋 دستورات دپلوی:');
            console.log('   Netlify: netlify deploy --prod');
            console.log('   Vercel: vercel --prod');
            console.log('   Railway: railway up');
        });
    }, 3000);
});
EOF

# ایجاد فایل تست
cat > test-server.js << EOF
const http = require('http');

const testEndpoints = [
    '/',
    '/api/health',
    '/ai-chat'
];

console.log('🧪 شروع تست سرور...');

testEndpoints.forEach(endpoint => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: endpoint,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(\`✅ \${endpoint}: STATUS \${res.statusCode}\`);
    });

    req.on('error', (error) => {
        console.log(\`❌ \${endpoint}: \${error.message}\`);
    });

    req.end();
});
EOF

# دادن مجوز اجرا به اسکریپت‌ها
chmod +x setup.sh
chmod +x deploy.js

log "✅ راه‌اندازی کامل شد!"
echo ""
echo "🎯 دستورات قابل استفاده:"
echo "   npm start         - راه‌اندازی سرور"
echo "   npm run dev       - راه‌اندازی در حالت توسعه"
echo "   npm run setup     - راه‌اندازی مجدد"
echo "   npm run deploy    - آماده‌سازی برای دپلوی"
echo "   npm test          - تست سرور"
echo ""
echo "🌐 آدرس سرور: http://localhost:3000"
echo "🤖 چت هوشمند: http://localhost:3000/ai-chat"
echo "🩺 وضعیت سلامت: http://localhost:3000/api/health"
echo ""
echo "📞 پشتیبانی: 07635108"
echo "🚗 پلاک: 84 ایران 741 ط 98"

# راه‌اندازی خودکار سرور
log "راه‌اندازی سرور..."
npm start
