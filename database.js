const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'database.json');

class Database {
  constructor() {
    this.data = this.load();
    this.initializeData();
  }

  load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    return this.getDefaultData();
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      return false;
    }
  }

  getDefaultData() {
    return {
      drivers: [],
      passengers: [],
      rides: [],
      users: [],
      config: {
        baseFare: 15000,
        perKmRate: 8000,
        perMinuteRate: 1500,
        minimumFare: 20000,
        maxSearchRadius: 5,
        cancellationFee: 10000
      }
    };
  }

  initializeData() {
    if (this.data.drivers.length === 0) {
      this.data.drivers = [
        {
          id: 1,
          name: 'علی محمدی',
          phone: '09121234567',
          car: { model: 'پژو 206', plate: 'الف ۱۲ ایران ۳۴۵', color: 'سفید', year: 1400 },
          rating: 4.8,
          totalTrips: 234,
          status: 'available',
          location: { lat: 27.1865, lng: 56.2768, address: 'میدان آزادی' },
          joinedDate: '2024-01-15'
        },
        {
          id: 2,
          name: 'حسن رضایی',
          phone: '09131234567',
          car: { model: 'سمند', plate: 'ب ۵۶ ایران ۷۸۹', color: 'نقره‌ای', year: 1401 },
          rating: 4.9,
          totalTrips: 456,
          status: 'busy',
          location: { lat: 27.1900, lng: 56.2800, address: 'خیابان امام خمینی' },
          joinedDate: '2023-06-20'
        },
        {
          id: 3,
          name: 'محمد احمدی',
          phone: '09141234567',
          car: { model: 'دنا', plate: 'ج ۹۱ ایران ۱۲۳', color: 'مشکی', year: 1402 },
          rating: 4.7,
          totalTrips: 189,
          status: 'available',
          location: { lat: 27.1850, lng: 56.2750, address: 'بلوار امام خمینی' },
          joinedDate: '2024-03-10'
        }
      ];

      this.data.passengers = [
        { id: 1, name: 'فاطمه کریمی', phone: '09151234567', totalTrips: 45, rating: 4.9, joinedDate: '2024-02-10' },
        { id: 2, name: 'مریم نوری', phone: '09161234567', totalTrips: 32, rating: 4.8, joinedDate: '2024-03-15' },
        { id: 3, name: 'زهرا حسینی', phone: '09171234567', totalTrips: 67, rating: 5.0, joinedDate: '2023-12-01' }
      ];

      this.data.rides = [
        {
          id: 1,
          driverId: 2,
          passengerId: 1,
          origin: { address: 'میدان آزادی', lat: 27.1865, lng: 56.2768 },
          destination: { address: 'بندر عباس', lat: 27.1900, lng: 56.2800 },
          status: 'active',
          price: 150000,
          distance: 5.2,
          duration: 15,
          startTime: new Date().toISOString()
        }
      ];

      this.save();
    }
  }

  // CRUD Operations
  getAllDrivers() {
    return this.data.drivers;
  }

  getDriverById(id) {
    return this.data.drivers.find(d => d.id === parseInt(id));
  }

  addDriver(driver) {
    const newId = Math.max(0, ...this.data.drivers.map(d => d.id)) + 1;
    const newDriver = { id: newId, ...driver, joinedDate: new Date().toISOString() };
    this.data.drivers.push(newDriver);
    this.save();
    return newDriver;
  }

  updateDriver(id, updates) {
    const index = this.data.drivers.findIndex(d => d.id === parseInt(id));
    if (index !== -1) {
      this.data.drivers[index] = { ...this.data.drivers[index], ...updates };
      this.save();
      return this.data.drivers[index];
    }
    return null;
  }

  deleteDriver(id) {
    const index = this.data.drivers.findIndex(d => d.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.drivers.splice(index, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  getAllPassengers() {
    return this.data.passengers;
  }

  getAllRides() {
    return this.data.rides;
  }

  addRide(ride) {
    const newId = Math.max(0, ...this.data.rides.map(r => r.id)) + 1;
    const newRide = { id: newId, ...ride, startTime: new Date().toISOString() };
    this.data.rides.push(newRide);
    this.save();
    return newRide;
  }

  getConfig() {
    return this.data.config;
  }
}

module.exports = new Database();
