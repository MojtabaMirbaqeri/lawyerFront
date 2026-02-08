# راهنمای نصب پکیج‌ها با Node.js v18.18.2

## مشکل:
- پکیج `oxc-parser` نیاز به native binding دارد که با Node.js v18 مشکل دارد
- `postinstall` script باعث خطا می‌شود

## راه‌حل 1: استفاده از --ignore-scripts + نصب دستی (✅ راه‌حل نهایی)

### مراحل:
```bash
# 1. پاک کردن node_modules و package-lock.json (اگر وجود دارد)
rm -rf node_modules package-lock.json

# 2. نصب پکیج‌ها بدون اجرای اسکریپت‌ها
npm install --ignore-scripts

# 3. نصب دستی native bindings (استفاده از اسکریپت خودکار)
./install-oxc-bindings.sh

# یا نصب دستی:
# npm pack @oxc-parser/binding-linux-x64-gnu@0.107.0
# mkdir -p node_modules/@oxc-parser/binding-linux-x64-gnu
# tar -xzf oxc-parser-binding-linux-x64-gnu-0.107.0.tgz -C node_modules/@oxc-parser/binding-linux-x64-gnu --strip-components=1
# rm oxc-parser-binding-linux-x64-gnu-0.107.0.tgz
# 
# npm pack @oxc-transform/binding-linux-x64-gnu@0.107.0
# mkdir -p node_modules/@oxc-transform/binding-linux-x64-gnu
# tar -xzf oxc-transform-binding-linux-x64-gnu-0.107.0.tgz -C node_modules/@oxc-transform/binding-linux-x64-gnu --strip-components=1
# rm oxc-transform-binding-linux-x64-gnu-0.107.0.tgz
#
# npm pack @oxc-minify/binding-linux-x64-gnu@0.107.0
# mkdir -p node_modules/@oxc-minify/binding-linux-x64-gnu
# tar -xzf oxc-minify-binding-linux-x64-gnu-0.107.0.tgz -C node_modules/@oxc-minify/binding-linux-x64-gnu --strip-components=1
# rm oxc-minify-binding-linux-x64-gnu-0.107.0.tgz

# 4. اجرای دستی nuxt prepare
npx nuxt prepare
```

**توضیح:**
- `--ignore-scripts`: از اجرای اسکریپت‌های postinstall جلوگیری می‌کند
- npm با optional dependencies مشکل دارد و آن‌ها را نصب نمی‌کند
- باید پکیج‌های native binding را به صورت دستی نصب کنیم
- این روش هیچ تغییری در سیستم یا Node.js ایجاد نمی‌کند

---

## راه‌حل 2: استفاده از --legacy-peer-deps

```bash
# 1. پاک کردن
rm -rf node_modules package-lock.json

# 2. نصب با legacy peer deps
npm install --legacy-peer-deps --ignore-scripts

# 3. نصب native binding
npm install @oxc-parser/binding-linux-x64-gnu --save-optional --legacy-peer-deps

# 4. اجرای nuxt prepare
npx nuxt prepare
```

**توضیح:**
- `--legacy-peer-deps`: از الگوریتم قدیمی npm برای حل وابستگی‌ها استفاده می‌کند
- این روش برای پروژه‌های قدیمی‌تر که با نسخه جدید npm مشکل دارند مناسب است

---

## راه‌حل 3: غیرفعال کردن موقت postinstall

```bash
# 1. ویرایش package.json و تغییر postinstall به postinstall-disabled
# (این کار را در فایل package.json انجام دهید)

# 2. نصب عادی
npm install

# 3. نصب native binding
npm install @oxc-parser/binding-linux-x64-gnu --save-optional

# 4. اجرای دستی
npx nuxt prepare

# 5. برگرداندن postinstall به حالت اولیه
```

---

## راه‌حل 4: استفاده از npm config

```bash
# تنظیم دائمی ignore-scripts (فقط برای این پروژه)
npm config set ignore-scripts true

# نصب
npm install

# نصب native binding
npm install @oxc-parser/binding-linux-x64-gnu --save-optional

# اجرای دستی
npx nuxt prepare

# برگرداندن تنظیمات
npm config set ignore-scripts false
```

---

## نکات مهم:
1. هیچ کدام از این روش‌ها Node.js یا سیستم را تغییر نمی‌دهند
2. فقط در دایرکتوری پروژه اجرا می‌شوند
3. اگر یکی کار نکرد، روش بعدی را امتحان کنید
4. بعد از نصب موفق، می‌توانید `npm run dev` را تست کنید

