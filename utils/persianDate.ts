/**
 * ابزارها و ثابت‌های مشترک برای انتخابگرهای تاریخ شمسی (سال / ماه و سال).
 * در هر جایی از پروژه می‌توان از این ماژول استفاده کرد.
 */

/** نام ماه‌های شمسی (۱ = فروردین، ۱۲ = اسفند) */
export const PERSIAN_MONTH_NAMES: readonly string[] = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const

/** مقدار ماه و سال شمسی (ماه ۱–۱۲) */
export interface PersianMonthYear {
  year: number
  month: number
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/**
 * تبدیل عدد انگلیسی به اعداد فارسی.
 * @example toPersianDigits(1402) => '۱۴۰۲'
 */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]!)
}

/**
 * نام ماه شمسی از روی شماره ماه (۱–۱۲).
 */
export function getPersianMonthName(month: number): string {
  return PERSIAN_MONTH_NAMES[month - 1] ?? ''
}

/**
 * لیست سال‌ها از max تا min (نزولی) برای استفاده در گرید سال.
 */
export function getYearRange(minYear: number, maxYear: number): number[] {
  const list: number[] = []
  for (let y = maxYear; y >= minYear; y--) list.push(y)
  return list
}
