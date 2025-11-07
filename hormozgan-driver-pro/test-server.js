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
        console.log(`✅ ${endpoint}: STATUS ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.log(`❌ ${endpoint}: ${error.message}`);
    });

    req.end();
});
