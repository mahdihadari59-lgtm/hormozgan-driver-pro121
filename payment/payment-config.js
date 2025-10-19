const sql = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'payments.db');

let db;

try {
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new sql.Database(fileBuffer);
    console.log('✅ Database loaded from file');
  } else {
    db = new sql.Database();
    console.log('🔄 Creating new database...');
    
    // Create tables
    db.run(`CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      authority TEXT UNIQUE,
      ref_id TEXT,
      status TEXT DEFAULT 'pending'
    )`);
    
    db.run(`CREATE TABLE rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pickup_address TEXT,
      destination_address TEXT,
      payment_status TEXT DEFAULT 'unpaid'
    )`);
    
    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log('✅ Database initialized');
  }
} catch (error) {
  console.error('❌ Database init error:', error);
  process.exit(1);
}

// Database functions
function run(sqlQuery, params = []) {
  try {
    const stmt = db.prepare(sqlQuery);
    stmt.run(params);
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    return { 
      changes: db.getRowsModified(), 
      lastInsertRowid: db.lastInsertRowid 
    };
  } catch (error) {
    console.error('❌ Database run error:', error);
    throw error;
  }
}

function get(sqlQuery, params = []) {
  try {
    const stmt = db.prepare(sqlQuery);
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    return result[0] || null;
  } catch (error) {
    console.error('❌ Database get error:', error);
    throw error;
  }
}

function all(sqlQuery, params = []) {
  try {
    const stmt = db.prepare(sqlQuery);
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    return result;
  } catch (error) {
    console.error('❌ Database all error:', error);
    throw error;
  }
}

module.exports = {
  run,
  get,
  all
};
