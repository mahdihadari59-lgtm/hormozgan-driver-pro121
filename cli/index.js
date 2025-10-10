
 const recordTrip = async () => {
  const trip = await inquirer.prompt([
    { type: 'input', name: 'from', message: '📍 از کجا؟' },
    { type: 'input', name: 'to', message: '🎯 به کجا؟' },
    {
      type: 'input',
      name: 'distance',
      message: '🚘 چند کیلومتر؟',
      validate: (v) => {
        const num = parseFloat(v);
        return !isNaN(num) && num > 0 ? true : 'لطفاً عدد معتبر وارد کن 🚗';
      },
    },
    {
      type: 'input',
      name: 'price',
      message: '💰 کرایه (تومان):',
      validate: (v) => {
        const num = parseFloat(v);
        return !isNaN(num) && num >= 0 ? true : 'عدد معتبر وارد کن 💵';
      },
    },
  ]);

  // ذخیره در فایل JSON
  const trips = fs.existsSync(TRIPS_FILE)
    ? JSON.parse(fs.readFileSync(TRIPS_FILE))
    : [];

  trips.push({ ...trip, date: new Date().toLocaleString('fa-IR') });

  fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
  console.log(chalk.green('✅ سفر با موفقیت ثبت شد!'));
};     name: 'fare', 
      message: 'کرایه (تومان):',
      validate: (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0 ? true : 'عدد وارد کنید'
    }
  ]);

  let trips = [];
  try { trips = JSON.parse(fs.readFileSync(TRIPS_FILE, 'utf8')); } catch {}

  trips.push({
    from: trip.from, to: trip.to,
    distance: parseFloat(trip.distance),
    fare: parseFloat(trip.fare),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fa-IR')
  });

  fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
  console.log(chalk.green('\n✓ ثبت شد\n'));
};

const showTrips = () => {
  try {
    const trips = JSON.parse(fs.readFileSync(TRIPS_FILE, 'utf8'));
    if (trips.length === 0) { console.log(chalk.yellow('\n⚠ خالی\n')); return; }

    const table = new Table({ head: ['#', 'تاریخ', 'مبدا', 'مقصد', 'km', 'تومان'] });
    let total = {fare: 0, km: 0};

    trips.forEach((t, i) => {
      table.push([i+1, t.date, t.from, t.to, t.distance, t.fare.toLocaleString('fa-IR')]);
      total.fare += t.fare; total.km += t.distance;
    });

    console.log('\n' + table.toString());
    console.log(chalk.cyan(`\n📊 ${trips.length} سفر | ${total.km} km | ${total.fare.toLocaleString('fa-IR')} تومان\n`));
  } catch { console.log(chalk.yellow('\n⚠ خالی\n')); }
};

const mainMenu = async () => {
  const {action} = await inquirer.prompt([{
    type: 'list', name: 'action', message: 'عملیات:',
    choices: [
      { name: '📝 ثبت سفر', value: 'record' },
      { name: '📋 لیست', value: 'list' },
      { name: '🗑️ پاک', value: 'clear' },
      { name: '❌ خروج', value: 'exit' }
    ]
  }]);

  if (action === 'record') await recordTrip();
  else if (action === 'list') showTrips();
  else if (action === 'clear') { fs.writeFileSync(TRIPS_FILE, '[]'); console.log(chalk.green('\n✓ پاک شد\n')); }
  else if (action === 'exit') { console.log(chalk.green('\n👋\n')); process.exit(0); }

  await inquirer.prompt([{type: 'input', name: 'c', message: 'Enter...'}]);
  await mainMenu();
};

mainMenu().catch(console.error)
