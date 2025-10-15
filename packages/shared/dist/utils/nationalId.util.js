"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNationalId = isValidNationalId;
exports.formatNationalId = formatNationalId;
/**
 * اعتبارسنجی کد ملی ایران
 */
function isValidNationalId(nationalId) {
    if (!nationalId || nationalId.length !== 10) {
        return false;
    }
    // بررسی تکراری نبودن ارقام
    if (/^(\d)\1{9}$/.test(nationalId)) {
        return false;
    }
    const check = parseInt(nationalId[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(nationalId[i]) * (10 - i);
    }
    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) ||
        (remainder >= 2 && check === 11 - remainder);
}
/**
 * فرمت کردن کد ملی
 * مثال: 1234567890 -> 123-456789-0
 */
function formatNationalId(nationalId) {
    if (!nationalId)
        return '';
    return nationalId.replace(/(\d{3})(\d{6})(\d{1})/, '$1-$2-$3');
}
//# sourceMappingURL=nationalId.util.js.map