const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
    userId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    status: { 
        type: DataTypes.ENUM('pending', 'accepted', 'started', 'completed', 'cancelled'), 
        defaultValue: 'pending' 
    },
    price: DataTypes.INTEGER,
    pickupLat: DataTypes.FLOAT,
    pickupLng: DataTypes.FLOAT,
    dropLat: DataTypes.FLOAT,
    dropLng: DataTypes.FLOAT,
    driverRating: DataTypes.FLOAT
});

module.exports = Trip;
