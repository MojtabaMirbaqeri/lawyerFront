/**
 * آدرس کامل تصویر برای نمایش (پروفایل، کارت وکیل و ...).
 * مسیر از دیتابیس ممکن است با / شروع شود (مثل /storage/profile_images/...).
 * قبل از ترکیب با imageBase، اسلش اول حذف می‌شود تا با اسلش پایانی imageBase تداخل نکند.
 *
 * @param {string|null|undefined} path - مسیر از API (مثل /storage/profile_images/x.jpg یا storage/profile_images/x.jpg)
 * @returns {string} - آدرس قابل استفاده در src
 */
export function useImageUrl(path) {
  const config = useRuntimeConfig();
  const base = (config.public?.imageBase || "").replace(/\/$/, "") || "";

  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const normalized = trimmed.replace(/^\//, "");
  return base ? `${base}/${normalized}` : `/${normalized}`;
}
