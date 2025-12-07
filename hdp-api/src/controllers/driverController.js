const { User, Driver, Trip, Payment, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get driver profile
exports.getProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'phone', 'fullName', 'email', 'avatar']
      }]
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    // Calculate statistics
    const stats = await calculateDriverStats(driver.id);

    res.json({
      success: true,
      driver: {
        ...driver.toJSON(),
        stats
      }
    });
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل'
    });
  }
};

// Update driver profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      nationalCode,
      licenseNumber,
      licenseExpiry,
      carModel,
      carYear,
      carColor,
      carPlate,
      carType
    } = req.body;

    let driver = await Driver.findOne({ where: { userId: req.user.id } });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    // Update driver
    const updateData = {};
    if (nationalCode) updateData.nationalCode = nationalCode;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (licenseExpiry) updateData.licenseExpiry = licenseExpiry;
    if (carModel) updateData.carModel = carModel;
    if (carYear) updateData.carYear = carYear;
    if (carColor) updateData.carColor = carColor;
    if (carPlate) updateData.carPlate = carPlate;
    if (carType) updateData.carType = carType;

    await driver.update(updateData);

    // Update user name if provided
    if (fullName) {
      await User.update({ fullName }, { where: { id: req.user.id } });
    }

    res.json({
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      driver
    });
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پروفایل'
    });
  }
};

// Go online
exports.goOnline = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    if (driver.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'حساب شما تایید نشده است'
      });
    }

    // Update location and status
    await driver.update({
      status: 'online',
      currentLocation: JSON.stringify({ latitude, longitude }),
      lastActive: new Date()
    });

    res.json({
      success: true,
      message: 'وضعیت آنلاین شد',
      driver
    });
  } catch (error) {
    console.error('Go online error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت'
    });
  }
};

// Go offline
exports.goOffline = async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    await driver.update({
      status: 'offline',
      lastActive: new Date()
    });

    res.json({
      success: true,
      message: 'وضعیت آفلاین شد',
      driver
    });
  } catch (error) {
    console.error('Go offline error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر وضعیت'
    });
  }
};

// Get trip requests
exports.getTripRequests = async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver || driver.status !== 'online') {
      return res.status(400).json({
        success: false,
        message: 'برای دریافت درخواست‌ها باید آنلاین باشید'
      });
    }

    const { latitude, longitude } = req.query;
    
    // Get pending trips for this car type
    const tripRequests = await Trip.findAll({
      where: {
        status: 'pending',
        carType: driver.carType
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'phone', 'rating']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      tripRequests,
      count: tripRequests.length
    });
  } catch (error) {
    console.error('Get trip requests error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت درخواست‌ها'
    });
  }
};

// Accept trip
exports.acceptTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver || driver.status !== 'online') {
      return res.status(400).json({
        success: false,
        message: 'برای پذیرش سفر باید آنلاین باشید'
      });
    }

    const trip = await Trip.findByPk(tripId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'phone']
      }]
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'سفر یافت نشد'
      });
    }

    if (trip.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'این سفر قبلاً پذیرفته شده است'
      });
    }

    // Update trip
    await trip.update({
      status: 'accepted',
      driverId: driver.id,
      acceptedAt: new Date()
    });

    // Update driver status
    await driver.update({
      status: 'busy'
    });

    res.json({
      success: true,
      message: 'سفر با موفقیت پذیرفته شد',
      trip
    });
  } catch (error) {
    console.error('Accept trip error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در پذیرش سفر'
    });
  }
};

// Start trip
exports.startTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOne({
      where: { 
        id: tripId,
        driverId: req.user.driverId
      },
      include: ['user']
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'سفر یافت نشد'
      });
    }

    if (trip.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'این سفر قابل شروع نیست'
      });
    }

    await trip.update({
      status: 'started',
      startedAt: new Date()
    });

    res.json({
      success: true,
      message: 'سفر شروع شد',
      trip
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در شروع سفر'
    });
  }
};

// Complete trip
exports.completeTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { finalPrice, rating } = req.body;
    
    const trip = await Trip.findOne({
      where: { 
        id: tripId,
        driverId: req.user.driverId
      },
      include: ['user']
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'سفر یافت نشد'
      });
    }

    if (trip.status !== 'started') {
      return res.status(400).json({
        success: false,
        message: 'این سفر قابل تکمیل نیست'
      });
    }

    const actualPrice = finalPrice || trip.price;
    
    // Complete trip
    await trip.update({
      status: 'completed',
      completedAt: new Date(),
      price: actualPrice,
      driverRating: rating
    });

    // Update driver stats
    const driver = await Driver.findByPk(req.user.driverId);
    await driver.update({
      totalTrips: driver.totalTrips + 1,
      totalEarnings: parseFloat(driver.totalEarnings) + parseFloat(actualPrice)
    });

    // Set driver back to online
    await driver.update({ status: 'online' });

    // Create payment record
    const payment = await Payment.create({
      tripId: trip.id,
      userId: trip.userId,
      driverId: driver.id,
      amount: actualPrice,
      status: 'pending',
      type: trip.paymentMethod
    });

    res.json({
      success: true,
      message: 'سفر با موفقیت به پایان رسید',
      trip,
      payment
    });
  } catch (error) {
    console.error('Complete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تکمیل سفر'
    });
  }
};

// Get earnings
exports.getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    const { period = 'week' } = req.query;
    
    const earnings = await calculateDriverEarnings(driver.id, period);
    const stats = await calculateDriverStats(driver.id);

    res.json({
      success: true,
      earnings,
      stats,
      walletBalance: driver.walletBalance
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت درآمدها'
    });
  }
};

// Get trip history
exports.getTripHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { driverId: req.user.driverId };
    if (status) where.status = status;

    const { count, rows: trips } = await Trip.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'phone', 'rating']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      trips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Trip history error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تاریخچه سفرها'
    });
  }
};

// Get current trip
exports.getCurrentTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        driverId: req.user.driverId,
        status: ['accepted', 'started']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'phone']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      trip: trip || null
    });
  } catch (error) {
    console.error('Current trip error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفر جاری'
    });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, heading, speed } = req.body;
    
    const driver = await Driver.findOne({ where: { userId: req.user.id } });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'راننده یافت نشد'
      });
    }

    // Update location
    await driver.update({
      currentLocation: JSON.stringify({ latitude, longitude }),
      heading: heading || null,
      speed: speed || null,
      lastLocationUpdate: new Date()
    });

    res.json({
      success: true,
      message: 'موقعیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی موقعیت'
    });
  }
};

// Helper functions
async function calculateDriverStats(driverId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [
    totalTrips,
    todayTrips,
    weekTrips,
    monthTrips,
    totalEarnings,
    todayEarnings,
    weekEarnings,
    monthEarnings
  ] = await Promise.all([
    Trip.count({ where: { driverId, status: 'completed' } }),
    Trip.count({ 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: today }
      } 
    }),
    Trip.count({ 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: weekAgo }
      } 
    }),
    Trip.count({ 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: monthAgo }
      } 
    }),
    
    Trip.sum('price', { 
      where: { driverId, status: 'completed' } 
    }),
    Trip.sum('price', { 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: today }
      } 
    }),
    Trip.sum('price', { 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: weekAgo }
      } 
    }),
    Trip.sum('price', { 
      where: { 
        driverId, 
        status: 'completed',
        completedAt: { [Op.gte]: monthAgo }
      } 
    })
  ]);

  return {
    totalTrips: totalTrips || 0,
    todayTrips: todayTrips || 0,
    weekTrips: weekTrips || 0,
    monthTrips: monthTrips || 0,
    totalEarnings: totalEarnings || 0,
    todayEarnings: todayEarnings || 0,
    weekEarnings: weekEarnings || 0,
    monthEarnings: monthEarnings || 0
  };
}

async function calculateDriverEarnings(driverId, period) {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const earnings = await Trip.findAll({
    where: {
      driverId,
      status: 'completed',
      completedAt: { [Op.gte]: startDate }
    },
    attributes: [
      [sequelize.fn('DATE', sequelize.col('completedAt')), 'date'],
      [sequelize.fn('COUNT', '*'), 'trips'],
      [sequelize.fn('SUM', sequelize.col('price')), 'earnings']
    ],
    group: [sequelize.fn('DATE', sequelize.col('completedAt'))],
    order: [[sequelize.fn('DATE', sequelize.col('completedAt')), 'ASC']]
  });

  return earnings;
}
