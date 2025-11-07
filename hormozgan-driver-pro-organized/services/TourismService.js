// خدمات گردشگری هوشمند هرمزگان
const { Pool } = require('pg');

class TourismService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    async getNearbyTouristSpots(lat, lng, radius = 5000, filters = {}) {
        try {
            const cacheKey = `spots_${lat}_${lng}_${JSON.stringify(filters)}`;
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            const spots = [
                {
                    id: 1,
                    name: "جزیره هرمز",
                    type: "historical",
                    location: { lat: 27.0966, lng: 56.4509 },
                    description: "جزیره رنگین‌کمان با خاک‌های رنگی",
                    rating: 4.8,
                    entranceFee: 50000,
                    images: ["hormoz1.jpg"],
                    facilities: ["پارکینگ", "رستوران"]
                },
                {
                    id: 2,
                    name: "ساحل درنگ", 
                    type: "beach",
                    location: { lat: 27.1800, lng: 56.2800 },
                    description: "ساحل زیبا با آب‌های فیروزه‌ای",
                    rating: 4.5,
                    entranceFee: 0,
                    images: ["drang1.jpg"],
                    facilities: ["پارکینگ", "سرویس بهداشتی"]
                }
            ];

            const filteredSpots = spots.filter(spot => {
                if (filters.type && spot.type !== filters.type) return false;
                if (filters.freeEntrance && spot.entranceFee > 0) return false;
                return true;
            });

            this.cache.set(cacheKey, {
                data: filteredSpots,
                timestamp: Date.now()
            });

            return filteredSpots;
        } catch (error) {
            console.error('خطا در دریافت مکان‌ها:', error);
            return [];
        }
    }

    async getAvailableTours() {
        const tours = [
            {
                id: 1,
                name: "تور یک روزه جزیره هرمز",
                description: "بازدید از جاذبه‌های اصلی جزیره",
                duration: "۱ روز",
                price: 250000,
                guideAvailable: true
            },
            {
                id: 2,
                name: "تور ساحلی درنگ",
                description: "لذت بردن از ساحل زیبا",
                duration: "نیم روز", 
                price: 150000,
                guideAvailable: false
            }
        ];
        return tours;
    }

    async bookTour(bookingData) {
        const booking = {
            id: Date.now(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        return { success: true, booking };
    }
}

module.exports = TourismService;
