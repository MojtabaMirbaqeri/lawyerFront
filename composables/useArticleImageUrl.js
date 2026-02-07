/**
 * آدرس کامل تصویر مقاله برای نمایش در فرانت (مثل عکس وکلا: imageBase + path).
 * اگر مقدار قبلاً URL کامل باشد بدون تغییر برمی‌گردد، وگرنه با imageBase ترکیب می‌شود.
 *
 * @param {string|null|undefined} image - مقدار فیلد image از API یا فرم (مسیر مثل /storage/articles/... یا URL کامل)
 * @returns {string} - آدرس قابل استفاده در src تصویر
 */
export function useArticleImageUrl(image) {
  const config = useRuntimeConfig();
  const imageBase = (config.public?.imageBase || "").replace(/\/$/, "") || "";

  if (!image || typeof image !== "string") return "";
  const trimmed = image.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return imageBase ? `${imageBase}${path}` : path;
}
