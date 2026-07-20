const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log('Request:', url);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Health
    if (url === '/api/health') {
        res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
        return;
    }
    
    // Weather - ساده ترین حالت
    if (url.startsWith('/api/weather')) {
        let city = 'بندرعباس';
        if (url.includes('city=')) {
            city = url.split('city=')[1].split('&')[0];
            city = decodeURIComponent(city);
        }
        
        const weatherData = {
            'بندرعباس': { temp: 35, condition: 'آفتابی', humidity: 60 },
            'قشم': { temp: 34, condition: 'آفتابی', humidity: 55 },
            'کیش': { temp: 33, condition: 'آفتابی', humidity: 50 }
        };
        
        const data = weatherData[city] || weatherData['بندرعباس'];
        
        res.end(JSON.stringify({
            success: true,
            city: city,
            temperature: data.temp + '°C',
            condition: data.condition,
            humidity: data.humidity + '%',
            updated: new Date().toISOString()
        }));
        return;
    }
    
    // Traffic
    if (url.startsWith('/api/traffic')) {
        let location = '';
        if (url.includes('location=')) {
            location = url.split('location=')[1].split('&')[0];
            location = decodeURIComponent(location);
        }
        
        const trafficData = {
            'چهارراه غزی': 'سنگین',
            'بلوار ساحلی': 'روان'
        };
        
        const status = trafficData[location] || 'متوسط';
        
        res.end(JSON.stringify({
            location: location || 'بندرعباس',
            status: status,
            updated: new Date().toISOString()
        }));
        return;
    }
    
    // Gold
    if (url === '/api/gold') {
        res.end(JSON.stringify({
            success: true,
            gold18: '4,852,000',
            updated: new Date().toISOString()
        }));
        return;
    }
    
    // Chat - POST
    if (url === '/api/ai/chat-pro' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const message = data.message || '';
                res.end(JSON.stringify({
                    ok: true,
                    intent: message.includes('طلا') ? 'gold' : 'general',
                    response: 'پاسخ به: ' + message
                }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }
    
    // 404
    res.end(JSON.stringify({ error: 'Not found', url: url }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('🚀 Simple HDP Server');
    console.log('══════════════════════════════════════════════════════');
    console.log(`✅ Port: ${PORT}`);
    console.log(`✅ Test: curl http://localhost:${PORT}/api/weather?city=بندرعباس`);
    console.log('══════════════════════════════════════════════════════\n');
});
