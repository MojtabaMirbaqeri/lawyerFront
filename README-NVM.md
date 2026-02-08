# راهنمای استفاده از NVM برای این پروژه

## ⚠️ مهم: این تنظیمات فقط برای این پروژه است و هیچ تاثیری روی سرور یا پروژه‌های دیگر ندارد

## مراحل نصب و استفاده:

### 1. نصب Node.js v20.19.0 با nvm (فقط یک بار):
```bash
cd /var/www/vakilvakil.com
source ~/.nvm/nvm.sh
nvm install 20.19.0
```

### 2. استفاده از Node.js v20 فقط در این پروژه:
```bash
cd /var/www/vakilvakil.com
source ~/.nvm/nvm.sh
nvm use 20.19.0
```

### 3. نصب پکیج‌ها:
```bash
npm install --ignore-scripts
./install-oxc-bindings.sh
npx nuxt prepare
```

### 4. اجرای پروژه:
```bash
npm run dev
```

## نکات مهم:

1. **فقط در این دایرکتوری**: `nvm use` فقط در همین shell session فعال می‌شود
2. **بدون تغییر در سرور**: Node.js سرور (v18.18.2) بدون تغییر باقی می‌ماند
3. **بدون تغییر در پروژه‌های دیگر**: هر پروژه دیگر همچنان از Node.js v18 استفاده می‌کند
4. **فایل .nvmrc**: این فایل فقط برای این پروژه است و به nvm می‌گوید از کدام نسخه استفاده کند

## برای استفاده خودکار:

می‌توانید یک alias در `.bashrc` یا `.zshrc` اضافه کنید:
```bash
alias vakilvakil='cd /var/www/vakilvakil.com && source ~/.nvm/nvm.sh && nvm use 20.19.0'
```

سپس فقط `vakilvakil` را تایپ کنید و بعد `npm run dev` را اجرا کنید.


