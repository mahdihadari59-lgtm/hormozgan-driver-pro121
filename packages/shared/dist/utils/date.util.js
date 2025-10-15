"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinutesDiff = getMinutesDiff;
exports.getHoursDiff = getHoursDiff;
exports.formatDuration = formatDuration;
exports.isExpired = isExpired;
exports.formatPersianDate = formatPersianDate;
exports.formatPersianDateTime = formatPersianDateTime;
/**
 * محاسبه اختلاف زمانی به دقیقه
 */
function getMinutesDiff(date1, date2) {
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff / 1000 / 60);
}
/**
 * محاسبه اختلاف زمانی به ساعت
 */
function getHoursDiff(date1, date2) {
    return getMinutesDiff(date1, date2) / 60;
}
/**
 * تبدیل دقیقه به فرمت ساعت و دقیقه
 */
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
        return `${mins} دقیقه`;
    }
    return `${hours} ساعت و ${mins} دقیقه`;
}
/**
 * بررسی منقضی شدن تاریخ
 */
function isExpired(expiryDate) {
    return new Date() > expiryDate;
}
/**
 * فرمت کردن تاریخ به فارسی
 */
function formatPersianDate(date) {
    return new Intl.DateTimeFormat('fa-IR').format(date);
}
/**
 * فرمت کردن تاریخ و ساعت به فارسی
 */
function formatPersianDateTime(date) {
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
//# sourceMappingURL=date.util.js.map