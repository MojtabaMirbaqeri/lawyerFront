# وکتورهای صفحه ورود و ثبت‌نام

در **`layouts/register.vue`** همین وکتورها از آدرس اینترنتی **SVG Repo** داخل تگ `<img>` لود می‌شوند. اگر به‌دلیل فیلتر یا قطع اینترنت تصویر نمایش داده نشد، می‌توانید آن‌ها را از لینک‌های زیر دانلود کرده و در **همین پوشه** با نام‌های مشخص‌شده ذخیره کنید و در کد به‌جای URL خارجی، از مسیر `/images/vectors/register/نام‌فایل.svg` استفاده کنید.

---

## لینک‌های مستقیم دانلود

### ۱. سپر و تیک (امنیت) — پنل چپ
- **استفاده:** بالای عنوان «وکیل وکیل»
- **منابع:**
  - **unDraw – Security** (با قابلیت تغییر رنگ به `#1e3a5f`):  
    https://undraw.co/illustrations/security  
  - **SVG Repo – Shield Check:**  
    https://www.svgrepo.com/download/372657/shield-check.svg  
- **ذخیره با نام:** `shield-check.svg` یا `security.svg`

### ۲. ترازوی عدالت — پنل راست (پایین‌چپ)
- **استفاده:** تزیین پس‌زمینه
- **منبع:**  
  https://www.svgrepo.com/download/404465/balance-scale-court-justice-scale-law-legal.svg  
- **ذخیره با نام:** `balance-scale.svg`

### ۳. سند / مدرک — پنل راست (بالا)
- **منبع (مستقیم در layout استفاده می‌شود):**  
  https://www.svgrepo.com/show/494331/document.svg  
- **جستجوی بیشتر:**  
  https://www.svgrepo.com/vectors/document/  
- **ذخیره با نام (برای استفاده لوکال):** `document.svg`

### ۴. قفل — موبایل (کنار «ورود و ثبت‌نام»)
- **منبع:**  
  https://www.svgrepo.com/download/469159/lock.svg  
- **ذخیره با نام:** `lock.svg`

### ۵. ورود امن / احراز هویت (تصویر بزرگ)
- **unDraw – Secure Login:**  
  https://undraw.co/illustrations/secure-login  
- **unDraw – Mobile Log in:**  
  https://undraw.co/illustrations/mobile-log-in  
- **Storyset – Authentication:**  
  https://storyset.com/illustration/authentication/pana  

---

## منابع عمومی وکتور رایگان

| منبع | لینک | توضیح |
|------|------|--------|
| **unDraw** | https://undraw.co | وکتورهای رایگان، قابل تغییر رنگ |
| **SVG Repo** | https://www.svgrepo.com | صدها هزار آیکون و وکتور (CC0) |
| **Storyset** | https://storyset.com | تصویرسازی‌های قابل سفارشی‌سازی |
| **Vecteezy** | https://www.vecteezy.com | وکتور حقوقی، ترازو، سپر |
| **The Noun Project** | https://thenounproject.com | آیکون و وکتور |
| **FreeSVG** | https://freesvg.org | وکتور دامنه عمومی |

---

## نحوه استفاده پس از دانلود

فایل‌های SVG را با **همان نام‌ها** در این پوشه (`public/images/vectors/register/`) قرار دهید.  
در `layouts/register.vue` از آدرس‌های زیر استفاده می‌شود (در صورت وجود فایل):

- `/images/vectors/register/shield-check.svg`
- `/images/vectors/register/balance-scale.svg`
- `/images/vectors/register/document.svg`
- `/images/vectors/register/lock.svg`

اگر خواستید از آدرس اینترنتی مستقیم (بدون دانلود) استفاده کنید، می‌توانید در کد به‌جای مسیر داخلی، همان لینک `https://www.svgrepo.com/...` را در `src` تگ `img` قرار دهید.
