
// ============ API ترافیک کامل ============
const trafficAPI = require('./traffic_api');
app.use('/api/traffic', trafficAPI);

console.log('   ✅ Traffic API v2.0 added');
console.log('      • /api/traffic/zones - لیست زون‌ها');
console.log('      • /api/traffic/hotspots - نقاط حادثه‌خیز');
console.log('      • /api/traffic/cameras - دوربین‌ها');
console.log('      • /api/traffic/accidents - تصادفات');
console.log('      • /api/traffic/alerts - هشدارها');
console.log('      • /api/traffic/summary - گزارش کامل');
