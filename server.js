const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');

// WebSocket - فقط یک بار
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket
wss.on('connection', (ws) => {
    console.log('🔗 کاربر جدید متصل شد');
    ws.send(JSON.stringify({ type: 'welcome', message: 'سلام! به WebSocket خوش آمدید' }));
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📩 پیام دریافت شد:', data);
            
            // پاسخ ساده
            const reply = { 
                type: 'reply', 
                message: 'پاسخ شما: ' + (data.message || data.text || '') 
            };
            ws.send(JSON.stringify(reply));
        } catch (e) {
            ws.send(JSON.stringify({ type: 'error', message: 'خطا در پردازش' }));
        }
    });
    
    ws.on('close', () => console.log('🔴 کاربر قطع شد'));
});

// مسیرهای HTTP
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat.html'));
});

app.get('/calls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calls.html'));
});

app.get('/driver-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-profile.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-dashboard.html'));
});

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        websocket: 'ws://localhost:' + PORT
    });
});

// API Chat
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'پیام وارد نشده است' });
    }
    
    const responses = {
        'سلام': 'سلام! 🌊 به چت‌بات هرمزگان خوش آمدید. چطور می‌توانم کمک کنم؟',
        'ترافیک': '🚦 وضعیت ترافیک بندرعباس:\n• بلوار پاسداران: روان\n• خیابان ساحلی: نیمه سنگین',
        'آب و هوا': '🌤️ هوای بندرعباس: ۳۸°C آفتابی، رطوبت ۶۵٪',
        'پشتیبانی': '📞 شماره پشتیبانی: ۰۷۶-۳۵۱۰۸'
    };
    
    let reply = 'منظور شما را متوجه نشدم. از گزینه‌های بالا استفاده کنید.';
    for (const [key, value] of Object.entries(responses)) {
        if (message.includes(key)) {
            reply = value;
            break;
        }
    }
    
    res.json({ reply });
});

// شروع سرور
server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('========================================');
    console.log('✅ Server running on http://localhost:' + PORT);
    console.log('🔊 WebSocket on ws://localhost:' + PORT);
    console.log('========================================');
    console.log('');
});
