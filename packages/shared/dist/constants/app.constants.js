"use strict";
/**
 * ثوابت برنامه
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HORMOZGAN_CITIES = exports.IRANIAN_PROVINCES = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.FILE_CONSTANTS = exports.OTP_CONSTANTS = exports.JWT_CONSTANTS = void 0;
// تنظیمات JWT
exports.JWT_CONSTANTS = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    ALGORITHM: 'HS256',
};
// تنظیمات OTP
exports.OTP_CONSTANTS = {
    LENGTH: 6,
    EXPIRY_MINUTES: 2,
    MAX_ATTEMPTS: 3,
};
// تنظیمات فایل
exports.FILE_CONSTANTS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
};
// پیام‌های خطا
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'شما مجوز دسترسی ندارید',
    FORBIDDEN: 'دسترسی مجاز نیست',
    NOT_FOUND: 'یافت نشد',
    INVALID_PHONE: 'شماره تلفن نامعتبر است',
    INVALID_OTP: 'کد تایید نامعتبر است',
    EXPIRED_OTP: 'کد تایید منقضی شده است',
    INVALID_NATIONAL_ID: 'کد ملی نامعتبر است',
    FILE_TOO_LARGE: 'حجم فایل بیش از حد مجاز است',
    INVALID_FILE_TYPE: 'نوع فایل مجاز نیست',
    SERVER_ERROR: 'خطای سرور',
};
// پیام‌های موفقیت
exports.SUCCESS_MESSAGES = {
    OTP_SENT: 'کد تایید ارسال شد',
    LOGIN_SUCCESS: 'ورود موفقیت‌آمیز',
    LOGOUT_SUCCESS: 'خروج موفقیت‌آمیز',
    PROFILE_UPDATED: 'پروفایل به‌روزرسانی شد',
    DOCUMENT_UPLOADED: 'مدرک بارگذاری شد',
};
// استان‌های ایران
exports.IRANIAN_PROVINCES = [
    'تهران',
    'هرمزگان',
    'خوزستان',
    'فارس',
    'اصفهان',
    'خراسان رضوی',
    'آذربایجان شرقی',
    'مازندران',
    'کرمان',
    'گیلان',
    'آذربایجان غربی',
    'کرمانشاه',
    'لرستان',
    'همدان',
    'کردستان',
    'یزد',
    'قم',
    'مرکزی',
    'زنجان',
    'سمنان',
    'قزوین',
    'گلستان',
    'اردبیل',
    'بوشهر',
    'ایلام',
    'چهارمحال و بختیاری',
    'کهگیلویه و بویراحمد',
    'سیستان و بلوچستان',
    'خراسان شمالی',
    'خراسان جنوبی',
    'البرز',
];
// شهرهای استان هرمزگان
exports.HORMOZGAN_CITIES = [
    'بندرعباس',
    'قشم',
    'کیش',
    'میناب',
    'بندرلنگه',
    'جاسک',
    'حاجی‌آباد',
    'رودان',
    'بستک',
    'پارسیان',
];
//# sourceMappingURL=app.constants.js.map