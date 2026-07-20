class TourismService {
    constructor() {
        this.destinations = {
            'قشم': { attractions: 'دره ستارگان، جنگل حرا', duration: 'یک روز' },
            'هرمز': { attractions: 'قلعه پرتغالی‌ها، دره رنگین‌کمان', duration: 'نیم روز' },
            'کیش': { attractions: 'کشتی یونانی، شهر زیرزمینی', duration: '۲ روز' }
        };
    }
    
    recommend(query) {
        for (let [dest, data] of Object.entries(this.destinations)) {
            if (query.includes(dest)) {
                return { response: `🏝️ ${dest}: ${data.attractions}`, destination: dest };
            }
        }
        return { response: '🏝️ مقاصد پیشنهادی: قشم، هرمز، کیش', destination: null };
    }
    
    getDestination(name) {
        return this.destinations[name] || null;
    }
}

module.exports = TourismService;
