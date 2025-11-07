const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const servers = [
    { host: 'localhost', port: 8080 },
    { host: 'localhost', port: 8081 },
    { host: 'localhost', port: 8082 }
];

let current = 0;

const server = http.createServer((req, res) => {
    const target = servers[current];
    current = (current + 1) % servers.length;
    
    proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
});

server.listen(80, () => {
    console.log('⚡ Load Balancer روی پورت 80');
});

proxy.on('error', (err, req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('خطا در اتصال به سرور');
});
