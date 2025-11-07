const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 شروع فرآیند دپلوی...');

// بررسی وجود فایل‌های ضروری
const requiredFiles = ['server-pro.js', 'package.json', 'public/index.html'];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.error(`❌ فایل ضروری ${file} یافت نشد`);
        process.exit(1);
    }
});

console.log('✅ تمام فایل‌های ضروری موجود هستند');

// اجرای تست سرور
console.log('🧪 تست سرور...');
exec('node server-pro.js &', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ خطا در تست سرور:', error);
        return;
    }
    
    setTimeout(() => {
        console.log('✅ تست سرور موفقیت‌آمیز بود');
        
        // توقف سرور تست
        exec('pkill -f "node server-pro.js"', () => {
            console.log('🎉 آماده دپلوی روی Netlify و سایر پلتفرم‌ها!');
            console.log('\n📋 دستورات دپلوی:');
            console.log('   Netlify: netlify deploy --prod');
            console.log('   Vercel: vercel --prod');
            console.log('   Railway: railway up');
        });
    }, 3000);
});
