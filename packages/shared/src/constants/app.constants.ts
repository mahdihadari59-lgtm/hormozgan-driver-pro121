/**
 * ثوابت برنامه
 */

// تنظیمات JWT
export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ALGORITHM: 'HS256',
} as const;

// تنظیمات OTP
export const OTP_CONSTANTS = {
  LENGTH: 6,
  EXPIRY_MINUTES: 2,
  MAX_ATTEMPTS: 3,
} as const;

// تنظیمات فایل
export const FILE_CONSTANTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
} as const;

// پیام‌های خطا
export const ERROR_MESSAGES = {
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
} as const;

// پیام‌های موفقیت
export const SUCCESS_MESSAGES = {
  OTP_SENT: 'کد تایید ارسال شد',
  LOGIN_SUCCESS: 'ورود موفقیت‌آمیز',
  LOGOUT_SUCCESS: 'خروج موفقیت‌آمیز',
  PROFILE_UPDATED: 'پروفایل به‌روزرسانی شد',
  DOCUMENT_UPLOADED: 'مدرک بارگذاری شد',
} as const;

// استان‌های ایران
export const IRANIAN_PROVINCES = [
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
] as const;

// شهرهای استان هرمزگان
export const HORMOZGAN_CITIES = [
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
] as const;
