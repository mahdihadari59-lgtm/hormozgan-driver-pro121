/**
 * ثوابت برنامه
 */
export declare const JWT_CONSTANTS: {
    readonly ACCESS_TOKEN_EXPIRY: "15m";
    readonly REFRESH_TOKEN_EXPIRY: "7d";
    readonly ALGORITHM: "HS256";
};
export declare const OTP_CONSTANTS: {
    readonly LENGTH: 6;
    readonly EXPIRY_MINUTES: 2;
    readonly MAX_ATTEMPTS: 3;
};
export declare const FILE_CONSTANTS: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: readonly ["image/jpeg", "image/png", "image/jpg"];
    readonly ALLOWED_EXTENSIONS: readonly [".jpg", ".jpeg", ".png"];
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "شما مجوز دسترسی ندارید";
    readonly FORBIDDEN: "دسترسی مجاز نیست";
    readonly NOT_FOUND: "یافت نشد";
    readonly INVALID_PHONE: "شماره تلفن نامعتبر است";
    readonly INVALID_OTP: "کد تایید نامعتبر است";
    readonly EXPIRED_OTP: "کد تایید منقضی شده است";
    readonly INVALID_NATIONAL_ID: "کد ملی نامعتبر است";
    readonly FILE_TOO_LARGE: "حجم فایل بیش از حد مجاز است";
    readonly INVALID_FILE_TYPE: "نوع فایل مجاز نیست";
    readonly SERVER_ERROR: "خطای سرور";
};
export declare const SUCCESS_MESSAGES: {
    readonly OTP_SENT: "کد تایید ارسال شد";
    readonly LOGIN_SUCCESS: "ورود موفقیت‌آمیز";
    readonly LOGOUT_SUCCESS: "خروج موفقیت‌آمیز";
    readonly PROFILE_UPDATED: "پروفایل به‌روزرسانی شد";
    readonly DOCUMENT_UPLOADED: "مدرک بارگذاری شد";
};
export declare const IRANIAN_PROVINCES: readonly ["تهران", "هرمزگان", "خوزستان", "فارس", "اصفهان", "خراسان رضوی", "آذربایجان شرقی", "مازندران", "کرمان", "گیلان", "آذربایجان غربی", "کرمانشاه", "لرستان", "همدان", "کردستان", "یزد", "قم", "مرکزی", "زنجان", "سمنان", "قزوین", "گلستان", "اردبیل", "بوشهر", "ایلام", "چهارمحال و بختیاری", "کهگیلویه و بویراحمد", "سیستان و بلوچستان", "خراسان شمالی", "خراسان جنوبی", "البرز"];
export declare const HORMOZGAN_CITIES: readonly ["بندرعباس", "قشم", "کیش", "میناب", "بندرلنگه", "جاسک", "حاجی‌آباد", "رودان", "بستک", "پارسیان"];
//# sourceMappingURL=app.constants.d.ts.map