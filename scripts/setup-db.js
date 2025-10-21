const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up database...');

const dbPath = path.join(__dirname, '../database.json');

// چک کردن اگه دیتابیس وجود نداره
if (!fs.existsSync(dbPath)) {
  const initialData = {
    drivers: [],
    passengers: [],
    trips: [],
    payments: [],
    users: []
  };
  
  try {
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  }
} else {
  console.log('✅ Database already exists');
}

console.log('🎉 Setup complete!');
