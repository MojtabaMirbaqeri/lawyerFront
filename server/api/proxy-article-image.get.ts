/**
 * پروکسی تصویر مقاله: تصویر را از بک‌اند (imageBase) گرفته و برمی‌گرداند تا از همان origin لود شود
 * و مشکل بلاک یا CORS پیش نیاید.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const imageBase = (config.public?.imageBase || "").replace(/\/$/, "");
  const apiBase = (config.public?.apiEndpoint || "").replace(/\/api\/?$/, "");

  const url = getQuery(event).url;
  if (!url || typeof url !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing url" });
  }

  const decoded = decodeURIComponent(url.trim());
  const allowedBase = imageBase || apiBase;
  if (!allowedBase || !decoded.startsWith(allowedBase)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  try {
    const res = await fetch(decoded, { method: "GET" });
    if (!res.ok) {
      throw createError({ statusCode: res.status, statusMessage: res.statusText });
    }
    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();
    setResponseHeaders(event, {
      "content-type": contentType,
      "cache-control": "public, max-age=86400",
    });
    return buffer;
  } catch (e: unknown) {
    if (e && typeof e === "object" && "statusCode" in e) throw e;
    throw createError({ statusCode: 502, statusMessage: "Bad Gateway" });
  }
});
