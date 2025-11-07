const http = require('http');
const { exec } = require('child_process');

function checkHealth() {
    http.get('http://localhost:8080/health', (res) => {
        if (res.statusCode !== 200) {
            console.error('❌ سرور ناسالم! ری‌استارت...');
            exec('pm2 restart hormozgan-driver');
        } else {
            console.log('✅ سرور سالم است');
        }
    }).on('error', (err) => {
        console.error('❌ خطا در بررسی سلامت:', err.message);
        exec('pm2 restart hormozgan-driver');
    });
}

// بررسی هر 30 ثانیه
setInterval(checkHealth, 30000);
console.log('🏥 Health Check شروع شد');
