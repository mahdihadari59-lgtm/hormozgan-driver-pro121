const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log('📡', url);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Health
    if (url === '/api/health') {
        res.end(JSON.stringify({ status: 'ok', time: Date.now() }));
        return;
    }
    
    // Gold
    if (url === '/api/gold') {
        res.end(JSON.stringify({ gold: '4,852,000', coin: '52,000,000' }));
        return;
    }
    
    // Weather
    if (url.includes('/api/weather')) {
        res.end(JSON.stringify({ city: 'بندرعباس', temp: '35°C', condition: 'آفتابی' }));
        return;
    }
    
    // Traffic
    if (url.includes('/api/traffic')) {
        res.end(JSON.stringify({ location: 'چهارراه غزی', status: 'سنگین' }));
        return;
    }
    
    // Bandari
    if (url === '/api/bandari') {
        res.end(JSON.stringify({ word: 'واویلا', meaning: 'چه قدر' }));
        return;
    }
    
    // Calendar
    if (url === '/api/calendar') {
        res.end(JSON.stringify({ date: '1403/03/20', weekday: 'سه‌شنبه' }));
        return;
    }
    
    // Fal
    if (url === '/api/fal') {
        res.end(JSON.stringify({ poem: 'صبا به لطف بگو آن غزال رعنا را' }));
        return;
    }
    
    // Stats
    if (url === '/api/stats') {
        res.end(JSON.stringify({ uptime: process.uptime() }));
        return;
    }
    
    // Chat - POST
   if (url === '/api/ai/chat-pro' && req.method === 'POST') {

    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {

        try {

            const data = JSON.parse(body);

            const flaskResponse = await fetch(
                'http://127.0.0.1:5000/api/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: data.message
                    })
                }
            );

            const result = await flaskResponse.json();

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                ok: true,
                response: result.response,
                source: result.source || 'rag'
            }));

        } catch (err) {

            res.statusCode = 500;

            res.end(JSON.stringify({
                ok: false,
                error: err.message
            }));
        }
    });

    return;
}
    
    // Intent - POST
    if (url === '/api/intent' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || '';
                let intent = 'general';
                if (text.includes('طلا')) intent = 'gold';
                else if (text.includes('هوا')) intent = 'weather';
                else if (text.includes('سلام')) intent = 'greeting';
                res.end(JSON.stringify({ intent: intent, confidence: 0.85 }));
            } catch(e) {
                res.end(JSON.stringify({ intent: 'general' }));
            }
        });
        return;
    }
    
    res.end(JSON.stringify({ error: 'not found' }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 HDP ONE SERVER RUNNING');
    console.log('========================================');
    console.log(`✅ Port: ${PORT}`);
    console.log(`✅ Address: http://localhost:${PORT}`);
    console.log('');
    console.log('📡 تست کنید:');
    console.log(`   curl http://localhost:${PORT}/api/health`);
    console.log(`   curl http://localhost:${PORT}/api/gold`);
    console.log('========================================\n');
});
