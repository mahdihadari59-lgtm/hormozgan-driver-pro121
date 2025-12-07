#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

console.log('🔨 شروع فرآیند ساخت برای دپلوی...');

// بررسی وجود فایل‌های ضروری
const requiredFiles = ['package.json', 'server.js', 'setup.js'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.log('❌ فایل‌های ضروری وجود ندارند:', missingFiles.join(', '));
    process.exit(1);
}

// ایجاد پوشه‌های مورد نیاز
const folders = ['public', 'logs', 'temp', 'functions'];
folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ پوشه ${folder} ایجاد شد`);
    }
});

// بررسی وابستگی‌ها
try {
    console.log('📦 بررسی وابستگی‌ها...');
    execSync('npm audit', { stdio: 'inherit' });
} catch (error) {
    console.log('⚠️ خطا در بررسی وابستگی‌ها');
}

// ساخت فایل‌های تولید
console.log('🏗️ ساخت فایل‌های تولید...');

// ایجاد فایل سلامت
const healthCheck = `
// Health check endpoint for deployment platforms
export default function handler(req, res) {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '6.0.0'
    });
}
`;

if (!fs.existsSync('functions/health.js')) {
    fs.writeFileSync('functions/health.js', healthCheck);
}

// بررسی پیکربندی
const configs = ['netlify.toml', 'vercel.json', 'railway.json', '.env'];
configs.forEach(config => {
    if (fs.existsSync(config)) {
        console.log(`✅ ${config} موجود است`);
    } else {
        console.log(`⚠️ ${config} وجود ندارد`);
    }
});

console.log('🎉 ساخت با موفقیت完成 شد!');
console.log('📁 فایل‌های ساخته شده:');
console.log('   • functions/health.js');
console.log('   • پوشه public/');
console.log('   • پوشه logs/');
console.log('   • پوشه temp/');

// اطلاعات سیستم
console.log('\n📊 اطلاعات سیستم:');
console.log(`   • پلتفرم: ${os.platform()}`);
console.log(`   • معماری: ${os.arch()}`);
console.log(`   • حافظه آزاد: ${Math.round(os.freemem() / 1024 / 1024)} MB`);
console.log(`   • حافظه کل: ${Math.round(os.totalmem() / 1024 / 1024)} MB`);

console.log('\n🚀 سیستم آماده دپلوی است!');
