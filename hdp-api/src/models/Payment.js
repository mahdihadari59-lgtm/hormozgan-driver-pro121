const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    userId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    tripId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' }
});

module.exports = Payment;
