#!/bin/bash
# اسکریپت نصب دستی پکیج‌های native binding برای oxc
# این اسکریپت برای حل مشکل npm با optional dependencies در Node.js v18 است

set -e

VERSION="0.107.0"
BASE_DIR="$(pwd)"

echo "🔧 در حال نصب پکیج‌های native binding..."

# تابع برای نصب یک پکیج
install_binding() {
    local package_name=$1
    local dir_name=$2
    
    echo "📦 نصب $package_name..."
    
    # دانلود پکیج
    npm pack "${package_name}@${VERSION}" > /dev/null 2>&1
    
    # استخراج و نصب
    mkdir -p "node_modules/${dir_name}"
    tar -xzf "${package_name}-${VERSION}.tgz" -C "node_modules/${dir_name}" --strip-components=1
    
    # پاک کردن فایل tgz
    rm -f "${package_name}-${VERSION}.tgz"
    
    echo "✅ $package_name نصب شد"
}

# نصب پکیج‌های مورد نیاز
install_binding "@oxc-parser/binding-linux-x64-gnu" "@oxc-parser/binding-linux-x64-gnu"
install_binding "@oxc-transform/binding-linux-x64-gnu" "@oxc-transform/binding-linux-x64-gnu"
install_binding "@oxc-minify/binding-linux-x64-gnu" "@oxc-minify/binding-linux-x64-gnu"

echo ""
echo "✨ همه پکیج‌های native binding با موفقیت نصب شدند!"
echo "💡 حالا می‌توانید 'npx nuxt prepare' را اجرا کنید"


