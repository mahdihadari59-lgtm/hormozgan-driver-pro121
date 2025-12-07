require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// امنیت
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// برای فرم‌ها و JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تنظیم قالب EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../public')));

// صفحه اصلی
app.get('/', (req, res) => {
    res.render('index', { title: "HDP v7 - Smart Hormozgan" });
});

// پورت سرور
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`🚀 HDP v7 Server Running on Port ${port}`);
});
