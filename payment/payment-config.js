// Simple in-memory database for payment system
// This works without sql.js installation issues

class SimpleDB {
  constructor() {
    this.transactions = [];
    this.rides = [];
    this.nextTransactionId = 1;
    this.nextRideId = 1;
    console.log('✅ Simple in-memory database initialized');
  }

  run(sql, params = []) {
    try {
      console.log('📝 Executing SQL:', sql.substring(0, 50) + '...');
      
      // شبیه‌سازی INSERT INTO transactions
      if (sql.includes('INSERT INTO transactions')) {
        const transaction = {
          id: this.nextTransactionId++,
          ride_id: params[0],
          user_id: params[1],
          amount: params[2],
          authority: params[3],
          status: params[4] || 'pending',
          gateway: params[5] || 'zarinpal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.transactions.push(transaction);
        console.log('💾 Transaction saved:', transaction.id);
        return { changes: 1, lastInsertRowid: transaction.id };
      }

      // شبیه‌سازی INSERT INTO rides
      if (sql.includes('INSERT INTO rides')) {
        const ride = {
          id: params[0],
          user_id: params[1],
          pickup_address: params[2],
          destination_address: params[3],
          payment_status: 'unpaid',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.rides.push(ride);
        console.log('🚗 Ride saved:', ride.id);
        return { changes: 1, lastInsertRowid: ride.id };
      }

      // شبیه‌سازی UPDATE transactions
      if (sql.includes('UPDATE transactions')) {
        const transactionId = params[params.length - 1];
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (transaction) {
          if (sql.includes('status = ?')) {
            transaction.status = params[0];
            transaction.ref_id = params[1];
            transaction.card_pan = params[2];
            transaction.verified_at = new Date().toISOString();
            console.log('✅ Transaction updated to success:', transactionId);
          } else if (sql.includes('status = ?')) {
            transaction.status = params[0];
            transaction.error_message = params[1];
            console.log('❌ Transaction updated to failed:', transactionId);
          }
          transaction.updated_at = new Date().toISOString();
          return { changes: 1 };
        }
      }

      // شبیه‌سازی UPDATE rides
      if (sql.includes('UPDATE rides')) {
        const rideId = params[1];
        const ride = this.rides.find(r => r.id === rideId);
        if (ride) {
          ride.payment_status = params[0];
          ride.updated_at = new Date().toISOString();
          console.log('🔄 Ride payment status updated:', rideId);
          return { changes: 1 };
        }
      }

      return { changes: 0, lastInsertRowid: null };
    } catch (error) {
      console.error('❌ Database run error:', error);
      throw error;
    }
  }

  get(sql, params = []) {
    try {
      console.log('🔍 Executing GET SQL:', sql.substring(0, 50) + '...');
      
      // شبیه‌سازی SELECT * FROM transactions WHERE authority = ?
      if (sql.includes('transactions WHERE authority = ?')) {
        const result = this.transactions.find(t => t.authority === params[0]) || null;
        console.log('📋 Found transaction by authority:', result ? result.id : 'null');
        return result;
      }

      // شبیه‌سازی SELECT * FROM rides WHERE id = ?
      if (sql.includes('rides WHERE id = ?')) {
        const result = this.rides.find(r => r.id === params[0]) || null;
        console.log('📋 Found ride by id:', result ? result.id : 'null');
        return result;
      }

      // شبیه‌سازی SELECT * FROM transactions WHERE id = ?
      if (sql.includes('transactions WHERE id = ?')) {
        const result = this.transactions.find(t => t.id === params[0]) || null;
        console.log('📋 Found transaction by id:', result ? result.id : 'null');
        return result;
      }

      return null;
    } catch (error) {
      console.error('❌ Database get error:', error);
      throw error;
    }
  }

  all(sql, params = []) {
    try {
      console.log('📊 Executing ALL SQL:', sql.substring(0, 50) + '...');
      
      // شبیه‌سازی SELECT با JOIN
      if (sql.includes('FROM transactions t LEFT JOIN rides r')) {
        const userId = params[0];
        const limit = params[1];
        
        const userTransactions = this.transactions
          .filter(t => t.user_id === userId)
          .slice(0, limit)
          .map(transaction => {
            const ride = this.rides.find(r => r.id === transaction.ride_id) || {};
            return {
              ...transaction,
              pickup_address: ride.pickup_address,
              destination_address: ride.destination_address
            };
          });

        console.log('📊 User transactions count:', userTransactions.length);
        return userTransactions;
      }

      // شبیه‌سازی SELECT * FROM transactions WHERE status = "pending"
      if (sql.includes('status = "pending"')) {
        const pendingTransactions = this.transactions.filter(t => t.status === 'pending');
        console.log('⏳ Pending transactions:', pendingTransactions.length);
        return pendingTransactions;
      }

      return [];
    } catch (error) {
      console.error('❌ Database all error:', error);
      throw error;
    }
  }
}

// ایجاد instance از دیتابیس
const db = new SimpleDB();

// ایجاد چند داده تستی برای شروع
console.log('🔄 Creating sample data...');
db.run(
  'INSERT INTO rides (id, user_id, pickup_address, destination_address) VALUES (?, ?, ?, ?)',
  [1, 100, 'میدان انقلاب', 'فرودگاه مهرآباد']
);

db.run(
  'INSERT INTO rides (id, user_id, pickup_address, destination_address) VALUES (?, ?, ?, ?)',
  [2, 101, 'تجریش', 'میدان ولیعصر']
);

console.log('✅ Database setup completed');

module.exports = db;
