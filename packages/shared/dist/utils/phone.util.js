"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIranianPhone = isValidIranianPhone;
exports.formatPhoneNumber = formatPhoneNumber;
exports.normalizePhoneNumber = normalizePhoneNumber;
/**
 * اعتبارسنجی شماره تلفن ایران
 */
function isValidIranianPhone(phone) {
    const regex = /^09[0-9]{9}$/;
    return regex.test(phone);
}
/**
 * فرمت کردن شماره تلفن
 * 09123456789 -> 0912 345 6789
 */
function formatPhoneNumber(phone) {
    if (!phone)
        return '';
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
}
/**
 * پاک کردن فرمت شماره تلفن
 * 0912 345 6789 -> 09123456789
 */
function normalizePhoneNumber(phone) {
    return phone.replace(/\s+/g, '').replace(/^(\+98)/, '0');
}
//# sourceMappingURL=phone.util.js.map