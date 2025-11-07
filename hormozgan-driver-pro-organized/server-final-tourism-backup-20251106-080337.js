// server-final-tourism.js - سرور نهایی با ماژول گردشگری
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

class HormozganTourismServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server);
        this.port = process.env.PORT || 8080;
        
        this.initializeSecurity();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSocket();
        this.initializeTourism();
    }

    initializeSecurity() {
        // Helmet for security headers
        this.app.use(helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000 // limit each IP to 1000 requests per windowMs
        });
        this.app.use(limiter);

        // CORS
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
    }

    initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`📥 ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
            next();
        });
    }

    initializeRoutes() {
        // Routes اصلی
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/pages/mobile-app.html'));
        });

        // Routes گردشگری
        const tourismRoutes = require('./routes/tourism');
        this.app.use('/api/tourism', tourismRoutes);

        // Routes صفحات
        const pages = [
            'mobile-app', 'modern-ui', 'ai-chat', 'traffic-ai', 'music-player',
            'festivals', 'payment', 'smart-map', 'driver-dashboard', 'security',
            'welcome', 'tourism', 'tourism-map'
        ];

        pages.forEach(page => {
            this.app.get(`/${page}`, (req, res) => {
                res.sendFile(path.join(__dirname, `public/pages/${page}.html`));
            });
        });

        // API Health Check
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'active',
                service: 'Hormozgan Driver Pro + Tourism',
                version: '3.0.0',
                timestamp: new Date().toISOString(),
                features: ['ai-assistant', 'driver-management', 'tourism-service', 'payment-system']
            });
        });

        // Route برای فایل‌های static
        this.app.get('/pages/:page', (req, res) => {
            const page = req.params.page;
            res.sendFile(path.join(__dirname, `public/pages/${page}.html`));
        });

        // Fallback route
        this.app.get('*', (req, res) => {
            res.status(404).json({
                error: 'صفحه مورد نظر یافت نشد',
                available_routes: [
                    '/mobile-app',
                    '/tourism', 
                    '/ai-chat',
                    '/smart-map',
                    '/api/tourism/spots/nearby',
                    '/api/health'
                ]
            });
        });
    }

    initializeSocket() {
        this.io.on('connection', (socket) => {
            console.log('🔌 کاربر متصل شد:', socket.id);

            socket.on('tourism-booking', (data) => {
                console.log('🎯 رزرو گردشگری:', data);
                socket.emit('booking-confirmed', {
                    id: Date.now(),
                    ...data,
                    status: 'confirmed'
                });
            });

            socket.on('driver-location', (data) => {
                socket.broadcast.emit('location-update', data);
            });

            socket.on('disconnect', () => {
                console.log('🔌 کاربر قطع شد:', socket.id);
            });
        });
    }

    initializeTourism() {
        console.log('🎯 ماژول گردشگری فعال شد');
        
        // اضافه کردن routeهای اضافی گردشگری
        this.app.get('/api/tourism/stats', async (req, res) => {
            try {
                const TourismService = require('./services/TourismService');
                const tourism = new TourismService();
                const stats = await tourism.getTourismStats();
                
                res.json({
                    success: true,
                    data: stats
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'خطا در دریافت آمار'
                });
            }
        });
    }

    start() {
        this.server.listen(this.port, '0.0.0.0', () => {
            console.log('\n' + '='.repeat(60));
            console.log('🚀 سرور هرمزگان درایور پرو + گردشگری راه‌اندازی شد');
            console.log('='.repeat(60));
            console.log(`📍 پورت: ${this.port}`);
            console.log(`🌐 آدرس اصلی: http://localhost:${this.port}`);
            console.log(`📱 اپ موبایل: http://localhost:${this.port}/mobile-app`);
            console.log(`🎯 گردشگری: http://localhost:${this.port}/tourism`);
            console.log(`🤖 چت هوشمند: http://localhost:${this.port}/ai-chat`);
            console.log(`🗺️  نقشه هوشمند: http://localhost:${this.port}/smart-map`);
            console.log(`❤️  سلامت سرویس: http://localhost:${this.port}/api/health`);
            console.log('='.repeat(60));
            console.log('⏰ زمان راه‌اندازی:', new Date().toLocaleString('fa-IR'));
            console.log('='.repeat(60) + '\n');
        });

        // مدیریت graceful shutdown
        process.on('SIGTERM', () => this.gracefulShutdown());
        process.on('SIGINT', () => this.gracefulShutdown());
    }

    gracefulShutdown() {
        console.log('\n🔴 در حال خاموش کردن سرور...');
        this.server.close(() => {
            console.log('✅ سرور با موفقیت خاموش شد');
            process.exit(0);
        });

        setTimeout(() => {
            console.log('❌ خاموش کردن اجباری سرور');
            process.exit(1);
        }, 10000);
    }
}

// راه‌اندازی سرور
const server = new HormozganTourismServer();
server.start();

module.exports = server;
