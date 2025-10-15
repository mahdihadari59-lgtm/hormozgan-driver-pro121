/**
 * اعتبارسنجی شماره تلفن ایران
 */
export declare function isValidIranianPhone(phone: string): boolean;
/**
 * فرمت کردن شماره تلفن
 * 09123456789 -> 0912 345 6789
 */
export declare function formatPhoneNumber(phone: string): string;
/**
 * پاک کردن فرمت شماره تلفن
 * 0912 345 6789 -> 09123456789
 */
export declare function normalizePhoneNumber(phone: string): string;
//# sourceMappingURL=phone.util.d.ts.map