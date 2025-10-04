/**
 * اعتبارسنجی شماره تلفن ایران
 */
export function isValidIranianPhone(phone: string): boolean {
  const regex = /^09[0-9]{9}$/;
  return regex.test(phone);
}

/**
 * فرمت کردن شماره تلفن
 * 09123456789 -> 0912 345 6789
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
}

/**
 * پاک کردن فرمت شماره تلفن
 * 0912 345 6789 -> 09123456789
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/^(\+98)/, '0');
}
