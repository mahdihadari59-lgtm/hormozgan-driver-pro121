class SimpleDB {
  constructor() {
    this.transactions = [];
    this.rides = [];
    this.nextTransactionId = 1;
    this.nextRideId = 1;
    console.log('Database initialized');
    this.createSamples();
  }

  createSamples() {
    this.run('INSERT INTO rides', [1, 100, 'Tehran', 'Airport']);
    this.run('INSERT INTO rides', [2, 101, 'North', 'South']);
  }

  run(sql, params = []) {
    try {
      if (sql.includes('INSERT INTO transactions')) {
        const t = {
          id: this.nextTransactionId++,
          ride_id: params[0],
          user_id: params[1],
          amount: params[2],
          authority: params[3],
          status: params[4] || 'pending',
          gateway: params[5] || 'zarinpal',
          ref_id: null,
          card_pan: null,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.transactions.push(t);
        return { changes: 1, lastInsertRowid: t.id };
      }

      if (sql.includes('INSERT INTO rides')) {
        const r = {
          id: params[0] || this.nextRideId++,
          user_id: params[1],
          pickup_address: params[2],
          destination_address: params[3],
          payment_status: 'unpaid',
          created_at: new Date().toISOString()
        };
        this.rides.push(r);
        return { changes: 1, lastInsertRowid: r.id };
      }

      if (sql.includes('UPDATE transactions') && sql.includes('ref_id')) {
        const tid = params[params.length - 1];
        const t = this.transactions.find(x => x.id === tid);
        if (t) {
          t.status = params[0];
          t.ref_id = params[1];
          t.card_pan = params[2];
          t.updated_at = new Date().toISOString();
          return { changes: 1 };
        }
      }

      if (sql.includes('UPDATE transactions') && sql.includes('error_message')) {
        const tid = params[params.length - 1];
        const t = this.transactions.find(x => x.id === tid);
        if (t) {
          t.status = params[0];
          t.error_message = params[1];
          return { changes: 1 };
        }
      }

      if (sql.includes('UPDATE rides')) {
        const rid = params[1];
        const r = this.rides.find(x => x.id === rid);
        if (r) {
          r.payment_status = params[0];
          return { changes: 1 };
        }
      }

      return { changes: 0 };
    } catch (e) {
      console.error('DB Error:', e);
      throw e;
    }
  }

  get(sql, params = []) {
    try {
      if (sql.includes('transactions') && sql.includes('authority')) {
        return this.transactions.find(t => t.authority === params[0]) || null;
      }
      if (sql.includes('rides') && sql.includes('id')) {
        return this.rides.find(r => r.id === params[0]) || null;
      }
      if (sql.includes('transactions') && sql.includes('id')) {
        return this.transactions.find(t => t.id === params[0]) || null;
      }
      return null;
    } catch (e) {
      console.error('DB Error:', e);
      throw e;
    }
  }

  all(sql, params = []) {
    try {
      if (sql.includes('LEFT JOIN')) {
        const uid = params[0];
        const lim = params[1] || 10;
        return this.transactions
          .filter(t => t.user_id === uid)
          .slice(0, lim)
          .map(t => {
            const r = this.rides.find(x => x.id === t.ride_id) || {};
            return { ...t, pickup_address: r.pickup_address, destination_address: r.destination_address };
          });
      }
      if (sql.includes('pending')) {
        return this.transactions.filter(t => t.status === 'pending');
      }
      return [];
    } catch (e) {
      console.error('DB Error:', e);
      throw e;
    }
  }
}

const db = new SimpleDB();
module.exports = db;
