// تنظیمات عمومی
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080',
    VERSION: 'v5.0',
    APP_NAME: 'Hormozgan Driver Pro'
};

// توابع کمکی
const Utils = {
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // می‌توانید اینجا یک نوتیفیکیشن واقعی اضافه کنید
    },
    
    formatPersianDate(date) {
        return new Date(date).toLocaleDateString('fa-IR');
    },
    
    saveToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    getFromStorage(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
};

// سرویس API
const API = {
    async get(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async post(endpoint, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// در دسترس قرار دادن برای سایر فایل‌ها
window.CONFIG = CONFIG;
window.Utils = Utils;
window.API = API;

console.log('✅ Common.js loaded successfully');
