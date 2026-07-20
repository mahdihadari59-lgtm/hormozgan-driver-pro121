const https = require('https');

class NeshanRouteService {
    constructor() {
        this.serviceKey = "service.47a8331510944eb2b292f68e8b9e3106";
    }

    async getRoute(origin, destination) {
        const body = JSON.stringify({
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            vehicle: "car",
            traffic: true
        });

        return new Promise((resolve) => {
            const req = https.request('https://api.neshan.org/v1/route', {
                method: 'POST',
                headers: {
                    'Api-Key': this.serviceKey,
                    'Content-Type': 'application/json'
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.routes && json.routes[0]) {
                            resolve({
                                success: true,
                                distance: (json.routes[0].distance / 1000).toFixed(1) + ' km',
                                duration: Math.round(json.routes[0].duration / 60) + ' دقیقه'
                            });
                        } else {
                            resolve({ success: false, error: 'مسیر یافت نشد' });
                        }
                    } catch(e) {
                        resolve({ success: false, error: 'خطا در پردازش' });
                    }
                });
            });
            req.on('error', () => resolve({ success: false, error: 'خطا در ارتباط' }));
            req.write(body);
            req.end();
        });
    }
}

module.exports = new NeshanRouteService();
