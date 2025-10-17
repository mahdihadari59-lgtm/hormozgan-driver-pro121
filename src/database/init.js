const db = require('../config/database');

console.log('📦 Creating database tables...');
console.log('');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('driver', 'passenger', 'admin')),
      verified INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table created: users');

  db.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      license_number TEXT UNIQUE,
      vehicle_type TEXT,
      vehicle_plate TEXT,
      vehicle_color TEXT,
      rating REAL DEFAULT 5.0,
      total_rides INTEGER DEFAULT 0,
      status TEXT DEFAULT 'offline',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Table created: drivers');

  db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      passenger_id INTEGER NOT NULL,
      driver_id INTEGER,
      pickup_address TEXT,
      destination_address TEXT,
      fare REAL,
      distance REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (passenger_id) REFERENCES users(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    )
  `);
  console.log('✅ Table created: rides');

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      refresh_token TEXT NOT NULL,
      device_info TEXT,
      ip_address TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Table created: sessions');

  console.log('');
  console.log('🎉 Database initialized successfully!');
  console.log('📊 Database location: ./data/database.sqlite');
  console.log('');

} catch (error) {
  console.error('❌ Error creating tables:', error.message);
  process.exit(1);
}

db.close();
