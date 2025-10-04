/**
 * محاسبه اختلاف زمانی به دقیقه
 */
export function getMinutesDiff(date1: Date, date2: Date): number {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diff / 1000 / 60);
}

/**
 * محاسبه اختلاف زمانی به ساعت
 */
export function getHoursDiff(date1: Date, date2: Date): number {
  return getMinutesDiff(date1, date2) / 60;
}

/**
 * تبدیل دقیقه به فرمت ساعت و دقیقه
 */
export function formatDuration(minutes: number): string {
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
export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

/**
 * فرمت کردن تاریخ به فارسی
 */
export function formatPersianDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR').format(date);
}

/**
 * فرمت کردن تاریخ و ساعت به فارسی
 */
export function formatPersianDateTime(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
