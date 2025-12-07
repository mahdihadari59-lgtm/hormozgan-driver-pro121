const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'driver', 'admin'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  walletBalance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  avatar: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users',
  timestamps: true
});

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  nationalCode: {
    type: DataTypes.STRING(10),
    unique: true
  },
  licenseNumber: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  licenseExpiry: {
    type: DataTypes.DATE
  },
  carModel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: DataTypes.INTEGER
  },
  carColor: {
    type: DataTypes.STRING
  },
  carPlate: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  carType: {
    type: DataTypes.ENUM('economy', 'comfort', 'premium', 'van'),
    defaultValue: 'economy'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended', 'online', 'offline', 'busy'),
    defaultValue: 'pending'
  },
  currentLocation: {
    type: DataTypes.STRING // Store as JSON string: {"lat": 27.1830, "lng": 56.2719}
  },
  heading: {
    type: DataTypes.FLOAT
  },
  speed: {
    type: DataTypes.FLOAT
  },
  totalTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationNotes: {
    type: DataTypes.TEXT
  },
  lastActive: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'drivers',
  timestamps: true
});

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  driverId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  pickupLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dropoffLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dropoffAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  carType: {
    type: DataTypes.ENUM('economy', 'comfort', 'premium', 'van'),
    defaultValue: 'economy'
  },
  passengers: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  distance: {
    type: DataTypes.DECIMAL(5, 2) // in km
  },
  duration: {
    type: DataTypes.INTEGER // in minutes
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'started', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'wallet', 'card'),
    defaultValue: 'cash'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  userRating: {
    type: DataTypes.INTEGER // 1-5
  },
  driverRating: {
    type: DataTypes.INTEGER // 1-5
  },
  userComment: {
    type: DataTypes.TEXT
  },
  driverComment: {
    type: DataTypes.TEXT
  },
  acceptedAt: {
    type: DataTypes.DATE
  },
  startedAt: {
    type: DataTypes.DATE
  },
  completedAt: {
    type: DataTypes.DATE
  },
  cancelledAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'trips',
  timestamps: true
});

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tripId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'trips',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  authority: {
    type: DataTypes.STRING
  },
  refId: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending'
  },
  gateway: {
    type: DataTypes.ENUM('zarinpal', 'wallet'),
    defaultValue: 'zarinpal'
  },
  description: {
    type: DataTypes.TEXT
  },
  verifiedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'payments',
  timestamps: true
});

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'otps',
  timestamps: true,
  indexes: [
    {
      fields: ['phone', 'code']
    }
  ]
});

// Define relationships
User.hasOne(Driver, { foreignKey: 'userId', as: 'driver' });
Driver.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Driver.hasMany(Trip, { foreignKey: 'driverId', as: 'trips' });
Trip.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasOne(Payment, { foreignKey: 'tripId', as: 'payment' });
Payment.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Driver,
  Trip,
  Payment,
  OTP,
  syncDatabase
};
