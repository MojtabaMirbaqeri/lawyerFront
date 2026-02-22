/**
 * آدرس کامل تصویر storage (پروفایل، کارت ملی، پروانه و غیره) برای نمایش در فرانت.
 * همیشه دقیقاً یک اسلش بین imageBase و مسیر قرار می‌گیرد تا از دو اسلش جلوگیری شود.
 *
 * @param {string|null|undefined} path - مسیر از API (مثل storage/profile_images/xxx.webp یا /storage/...)
 * @returns {string} - آدرس قابل استفاده در src تصویر
 */
export function useStorageImageUrl(path) {
  const config = useRuntimeConfig();
  const imageBase = (config.public?.imageBase || "").replace(/\/$/, "") || "";

  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const normalizedPath = trimmed.replace(/^\//, "");
  return imageBase ? `${imageBase}/${normalizedPath}` : (normalizedPath ? `/${normalizedPath}` : "");
}
