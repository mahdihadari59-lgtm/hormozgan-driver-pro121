class NeighborhoodRouteService {
    constructor() {
        this.neighborhoods = {
            'سورو': { lat: 27.1850, lng: 56.2600, name: 'محله سورو' },
            'نایبند': { lat: 27.1780, lng: 56.2700, name: 'محله نایبند' },
            'پل سفید': { lat: 27.1900, lng: 56.2750, name: 'پل سفید' },
            'طاقی': { lat: 27.1750, lng: 56.2800, name: 'محله طاقی' },
            'چهارراه غزی': { lat: 27.1833, lng: 56.2667, name: 'چهارراه غزی' },
            'بلوار ساحلی': { lat: 27.1860, lng: 56.2580, name: 'بلوار ساحلی' },
            'میدان سپاه': { lat: 27.1880, lng: 56.2720, name: 'میدان سپاه' }
        };
    }

    getNeighborhoods() {
        return Object.keys(this.neighborhoods).map(key => ({
            id: key,
            name: this.neighborhoods[key].name,
            lat: this.neighborhoods[key].lat,
            lng: this.neighborhoods[key].lng
        }));
    }

    getCoordinates(name) {
        return this.neighborhoods[name] || null;
    }

    async getRoute(from, to) {
        const fromCoord = this.getCoordinates(from);
        const toCoord = this.getCoordinates(to);
        
        if (!fromCoord || !toCoord) {
            return { success: false, error: 'محله یافت نشد' };
        }
        
        // محاسبه فاصله تقریبی (تخمینی)
        const distance = this.calculateDistance(fromCoord, toCoord);
        const duration = Math.round(distance * 3);
        
        let status = 'معمولی 🚦';
        if (from === 'چهارراه غزی') status = 'سنگین ⚠️';
        else if (from === 'میدان سپاه') status = 'نیمه سنگین 🟡';
        else status = 'روان ✅';
        
        return {
            success: true,
            source: 'HDP ONE Local',
            from: fromCoord.name,
            to: toCoord.name,
            distance: distance.toFixed(1) + ' km',
            duration: duration + ' دقیقه',
            status: status,
            trafficDelay: '0 دقیقه'
        };
    }

    calculateDistance(point1, point2) {
        const R = 6371;
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLon = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(point1.lat * Math.PI/180) * Math.cos(point2.lat * Math.PI/180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

module.exports = new NeighborhoodRouteService();
