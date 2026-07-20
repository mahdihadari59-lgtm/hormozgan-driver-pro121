const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log('📡 درخواست:', url);
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // پاسخ به همه درخواست‌ها
    if (url === '/api/health') {
        res.end(JSON.stringify({ status: 'ok', message: 'سرور کار می‌کند!' }));
        return;
    }
    
    if (url === '/api/gold') {
        res.end(JSON.stringify({ gold: '4,852,000', source: 'test' }));
        return;
    }
    
    if (url.includes('/api/weather')) {
        res.end(JSON.stringify({ city: 'بندرعباس', temp: '35°C', condition: 'آفتابی' }));
        return;
    }
    
    if (url.includes('/api/traffic')) {
        res.end(JSON.stringify({ location: 'چهارراه غزی', status: 'سنگین' }));
        return;
    }
    
    res.end(JSON.stringify({ error: 'not found', url: url }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🚀 TEST SERVER RUNNING');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Port: ${PORT}`);
    console.log(`✅ Test: curl http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════════\n');
});
