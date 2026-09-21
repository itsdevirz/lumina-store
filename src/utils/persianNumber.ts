/**
 * Persian number utilities for formatting numbers and converting Latin digits to Persian digits.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts any Latin numbers in a string or number to Persian digits.
 * Example: 2026 -> ۲۰۲۶, "Page 2" -> "Page ۲"
 */
export const toPersianDigits = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.replace(/[0-9]/g, (char) => PERSIAN_DIGITS[+char] || char);
};

/**
 * Formats a number with Persian digit grouping (e.g. ۱۲,۳۴۵)
 */
export const formatPersianNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '۰';
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return toPersianDigits(value);
  return num.toLocaleString('fa-IR');
};

/**
 * Formats a currency amount in Tomans with Persian digits
 */
export const formatPersianTomans = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '۰ تومان';
  return `${amount.toLocaleString('fa-IR')} تومان`;
};
