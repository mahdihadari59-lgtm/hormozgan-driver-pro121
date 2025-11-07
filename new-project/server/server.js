const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket
wss.on('connection', (ws) => {
    console.log('🔗 کاربر جدید متصل شد');
    ws.send(JSON.stringify({ type: 'welcome', message: 'به Hormozgan Driver Pro خوش آمدید' }));
});

// Routes اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/festivals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'festivals.html'));
});

app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'music-player.html'));
});

app.get('/calls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calls.html'));
});

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat.html'));
});

app.get('/driver-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-profile.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// API Status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        server: 'Hormozgan Driver Pro',
        version: '5.0.0',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// شروع سرور
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║        🎊 Hormozgan Driver Pro       ║
╠════════════════════════════════════════╣
║   🚀 سرور روی پورت ${PORT} اجرا شد    ║
║                                        ║
║   📱 http://localhost:${PORT}/           ║
║                                        ║
║   ✅ سرور فعال و آماده خدمات!        ║
╚════════════════════════════════════════╝
    `);
});
