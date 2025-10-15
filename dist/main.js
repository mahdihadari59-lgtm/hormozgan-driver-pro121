"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Hormozgan Driver Pro is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.get('/api/v1/status', (req, res) => {
    res.json({
        service: 'Hormozgan Driver Pro',
        status: 'active',
        environment: process.env.NODE_ENV || 'development'
    });
});
// Root Route
app.get('/', (req, res) => {
    res.json({
        message: '🚕 Welcome to Hormozgan Driver Pro API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api/v1/status'
        }
    });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`,
        availableRoutes: ['/', '/health', '/api/v1/status']
    });
});
// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});
// Start Server
app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log(`🚕 Hormozgan Driver Pro`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ========================================');
});
exports.default = app;
//# sourceMappingURL=main.js.map