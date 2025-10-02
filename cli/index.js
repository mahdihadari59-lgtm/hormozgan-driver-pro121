#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const figlet = require('figlet');
const Table = require('cli-table3');
const ora = require('ora');

// نمایش لوگو
console.clear();
console.log(
  chalk.yellow(
    figlet.textSync('Driver Pro', { horizontalLayout: 'full' })
  )
);
console.log(chalk.blue('🚗 سامانه راننده هرمزگان - نسخه CLI\n'));

// منوی اصلی
const mainMenu = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'عملیات مورد نظر را انتخاب کنید:',
      choices: [
        { name: '📍 مشاهده موقعیت فعلی', value: 'location' },
        { name: '🚗 سفرهای امروز', value: 'trips' },
        { name: '💰 درآمد امروز', value: 'earnings' },
        { name: '⭐ امتیاز و نظرات', value: 'rating' },
        { name: '🗺️  مسیریابی هوشمند', value: 'navigation' },
        { name: '📊 آمار هفتگی', value: 'stats' },
        { name: '⚙️  تنظیمات', value: 'settings' },
        { name: '❌ خروج', value: 'exit' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'location':
      await showLocation();
      break;
    case 'trips':
      await showTrips();
      break;
    case 'earnings':
      await showEarnings();
      break;
    case 'rating':
      await showRating();
      break;
    case 'navigation':
      await showNavigation();
      break;
    case 'stats':
      await showStats();
      break;
    case 'settings':
      await showSettings();
      break;
    case 'exit':
      console.log(chalk.green('\n👋 خداحافظ!\n'));
      process.exit(0);
  }

  // بازگشت به منوی اصلی
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'برای ادامه Enter بزنید...'
    }
  ]);
  await mainMenu();
};

// نمایش موقعیت
const showLocation = async () => {
  const spinner = ora('در حال دریافت موقعیت...').start();
  
  setTimeout(() => {
    spinner.succeed('موقعیت دریافت شد');
    
    console.log(chalk.blue('\n📍 موقعیت فعلی شما:\n'));
    const table = new Table();
    table.push(
      { 'عرض جغرافیایی': '27.1840° N' },
      { 'طول جغرافیایی': '56.2770° E' },
      { 'شهر': 'بندرعباس' },
      { 'دقت': '±10 متر' }
    );
    console.log(table.toString());
  }, 1000);
};

// نمایش سفرها
const showTrips = async () => {
  const spinner = ora('در حال بارگذاری سفرها...').start();
  
  setTimeout(() => {
    spinner.succeed('سفرها بارگذاری شد');
    
    console.log(chalk.blue('\n🚗 سفرهای امروز:\n'));
    const table = new Table({
      head: ['شماره', 'مبدا', 'مقصد', 'مسافت', 'درآمد', 'وضعیت']
    });
    
    table.push(
      ['1', 'بندرعباس', 'قشم', '۲۵ کیلومتر', '۵۰۰,۰۰۰ تومان', chalk.green('✓ تکمیل')],
      ['2', 'قشم', 'کیش', '۱۵۰ کیلومتر', '۱,۲۰۰,۰۰۰ تومان', chalk.green('✓ تکمیل')],
      ['3', 'کیش', 'بندرعباس', '۱۸۰ کیلومتر', '۱,۵۰۰,۰۰۰ تومان', chalk.yellow('⏳ در حال انجام')]
    );
    
    console.log(table.toString());
    console.log(chalk.cyan('\n📊 جمع کل: ۳ سفر | درآمد: ۳,۲۰۰,۰۰۰ تومان\n'));
  }, 1000);
};

// نمایش درآمد
const showEarnings = async () => {
  const spinner = ora('در حال محاسبه درآمد...').start();
  
  setTimeout(() => {
    spinner.succeed('درآمد محاسبه شد');
    
    console.log(chalk.blue('\n💰 گزارش درآمد:\n'));
    const table = new Table();
    table.push(
      { 'درآمد امروز': chalk.green('۳,۲۰۰,۰۰۰ تومان') },
      { 'درآمد هفته': chalk.cyan('۱۸,۵۰۰,۰۰۰ تومان') },
      { 'درآمد ماه': chalk.magenta('۶۵,۰۰۰,۰۰۰ تومان') },
      { 'کمیسیون سامانه': chalk.red('-۳,۲۵۰,۰۰۰ تومان') },
      { 'قابل برداشت': chalk.green.bold('۶۱,۷۵۰,۰۰۰ تومان') }
    );
    console.log(table.toString());
  }, 1000);
};

// نمایش امتیاز
const showRating = async () => {
  console.log(chalk.blue('\n⭐ امتیاز و نظرات:\n'));
  const table = new Table();
  table.push(
    { 'امتیاز کلی': chalk.yellow('⭐⭐⭐⭐⭐ 4.8/5') },
    { 'تعداد نظرات': '۱۲۸ نظر' },
    { 'نظرات مثبت': chalk.green('۹۵٪') },
    { 'رتبه شما': 'رتبه ۱۵ از ۵۰۰ راننده' }
  );
  console.log(table.toString());
};

// مسیریابی هوشمند
const showNavigation = async () => {
  const destination = await inquirer.prompt([
    {
      type: 'input',
      name: 'address',
      message: 'مقصد را وارد کنید:'
    }
  ]);

  const spinner = ora('در حال محاسبه بهترین مسیر...').start();
  
  setTimeout(() => {
    spinner.succeed('مسیر محاسبه شد');
    
    console.log(chalk.blue('\n🗺️  مسیرهای پیشنهادی:\n'));
    const table = new Table({
      head: ['مسیر', 'مسافت', 'زمان', 'ترافیک', 'هزینه سوخت']
    });
    
    table.push(
      [chalk.green('مسیر ۱ (توصیه شده)'), '۲۵ کیلومتر', '۳۰ دقیقه', '🟢 عادی', '۱۵۰,۰۰۰ تومان'],
      ['مسیر ۲', '۲۸ کیلومتر', '۲۵ دقیقه', '🟡 متوسط', '۱۷۰,۰۰۰ تومان'],
      ['مسیر ۳', '۲۲ کیلومتر', '۴۵ دقیقه', '🔴 سنگین', '۱۳۰,۰۰۰ تومان']
    );
    
    console.log(table.toString());
  }, 1500);
};

// نمایش آمار
const showStats = async () => {
  const spinner = ora('در حال تجزیه و تحلیل...').start();
  
  setTimeout(() => {
    spinner.succeed('آمار آماده شد');
    
    console.log(chalk.blue('\n📊 آمار هفتگی:\n'));
    const table = new Table({
      head: ['روز', 'سفرها', 'کیلومتر', 'درآمد', 'امتیاز']
    });
    
    table.push(
      ['شنبه', '۵', '۱۲۰', '۲,۵۰۰,۰۰۰', '⭐ 4.8'],
      ['یکشنبه', '۷', '۱۸۵', '۳,۲۰۰,۰۰۰', '⭐ 4.9'],
      ['دوشنبه', '۶', '۱۵۰', '۲,۸۰۰,۰۰۰', '⭐ 4.7'],
      ['سه‌شنبه', '۸', '۲۱۰', '۳,۸۰۰,۰۰۰', '⭐ 5.0'],
      ['چهارشنبه', '۴', '۹۵', '۲,۱۰۰,۰۰۰', '⭐ 4.6'],
      ['پنجشنبه', '۶', '۱۴۰', '۲,۶۰۰,۰۰۰', '⭐ 4.8'],
      ['جمعه', '۳', '۷۵', '۱,۵۰۰,۰۰۰', '⭐ 4.9']
    );
    
    console.log(table.toString());
    console.log(chalk.cyan('\n📈 میانگین: ۵.۶ سفر/روز | ۱۳۹ کیلومتر/روز | ۲,۶۴۲,۸۵۷ تومان/روز\n'));
  }, 1000);
};

// تنظیمات
const showSettings = async () => {
  const settings = await inquirer.prompt([
    {
      type: 'list',
      name: 'setting',
      message: 'تنظیمات:',
      choices: [
        'تغییر رمز عبور',
        'تنظیمات اعلان‌ها',
        'اطلاعات بانکی',
        'پروفایل',
        'بازگشت'
      ]
    }
  ]);

  if (settings.setting !== 'بازگشت') {
    console.log(chalk.yellow(`\n⚙️  ${settings.setting} در نسخه بعدی فعال می‌شود.\n`));
  }
};

// شروع برنامه
mainMenu().catch(console.error);
