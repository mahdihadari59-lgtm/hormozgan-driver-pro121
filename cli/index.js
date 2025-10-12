#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const TRIPS_FILE = path.join(__dirname, "../data/trips.json");

// 📦 اطمینان از وجود پوشه data
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// 🚖 ثبت سفر جدید
async function recordTrip() {
  const trip = await inquirer.prompt([
    { type: "input", name: "from", message: "📍 از کجا؟" },
    { type: "input", name: "to", message: "🎯 به کجا؟" },
    { type: "input", name: "distance", message: "🚘 چند کیلومتر؟" },
    { type: "input", name: "price", message: "💰 کرایه (تومان):" },
    { type: "input", name: "driver", message: "👨‍✈️ نام راننده:" },
  ]);

  const trips = fs.existsSync(TRIPS_FILE)
    ? JSON.parse(fs.readFileSync(TRIPS_FILE))
    : [];

  trips.push({ ...trip, date: new Date().toISOString() });
  fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), "utf8");

  console.log(chalk.green("✅ سفر با موفقیت ذخیره شد!"));
}

// 📜 مشاهده سفرهای ذخیره‌شده
function showTrips() {
  if (!fs.existsSync(TRIPS_FILE)) {
    console.log(chalk.yellow("⚠️ هنوز سفری ثبت نشده است."));
    return;
  }

  const trips = JSON.parse(fs.readFileSync(TRIPS_FILE, "utf8"));
  console.log(chalk.cyan("\n📘 فهرست سفرها:\n"));
  trips.forEach((t, i) => {
    console.log(
      chalk.white(
        `${i + 1}. ${t.from} → ${t.to} | ${t.distance} km | ${t.price} تومان | راننده: ${t.driver} | تاریخ: ${new Date(
          t.date
        ).toLocaleString("fa-IR")}`
      )
    );
  });
  console.log();
}

// 🧭 منوی اصلی CLI
async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "🚖 چه کاری می‌خواهید انجام دهید؟",
      choices: [
        { name: "➕ ثبت سفر جدید", value: "record" },
        { name: "📜 مشاهده سفرها", value: "list" },
        { name: "🚪 خروج", value: "exit" },
      ],
    },
  ]);

  if (action === "record") {
    await recordTrip();
  } else if (action === "list") {
    showTrips();
  } else {
    console.log(chalk.blue("👋 خداحافظ!"));
    process.exit(0);
  }

  // بعد از هر عملیات، دوباره منو را نمایش بده
  await mainMenu();
}

// ▶️ اجرای ایمن برنامه بدون خطای async سطح بالا
(async () => {
  try {
    await mainMenu();
  } catch (err) {
    console.error(chalk.red("❌ خطا:", err.message));
  }
})();
